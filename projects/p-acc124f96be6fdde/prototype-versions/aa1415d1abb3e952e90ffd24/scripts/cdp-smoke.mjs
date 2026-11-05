import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const debugPorts = [9222, 9230];
const pages = [];
for (const port of debugPorts) {
  try {
    const portPages = await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(800) }).then((response) => response.json());
    pages.push(...portPages);
  } catch {
    // Try the next local Chrome debugging port.
  }
}

if (!pages.length) throw new Error("Chrome debugging session was not found.");
const target = pages.find((page) => page.type === "page" && page.url.includes("5173"));

if (!target) throw new Error("Prototype page was not found in the Chrome session.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolveOpen, rejectOpen) => {
  socket.addEventListener("open", resolveOpen, { once: true });
  socket.addEventListener("error", rejectOpen, { once: true });
});

let sequence = 0;
const pending = new Map();
const consoleErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve: resolveCall, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolveCall(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") consoleErrors.push(message.params.exceptionDetails.text);
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") consoleErrors.push(message.params.entry.text);
});

function call(method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve: resolveCall, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function settle() {
  await evaluate("new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))");
  await new Promise((resolveWait) => setTimeout(resolveWait, 500));
}

async function clickButton(text, exact = true) {
  const result = await evaluate(`(() => {
    const buttons = [...document.querySelectorAll('button')];
    const target = buttons.find((button) => ${exact ? "button.textContent.trim() === " : "button.textContent.includes("}${JSON.stringify(text)}${exact ? "" : ")"});
    if (!target) return { ok: false, labels: buttons.map((button) => button.textContent.trim()).filter(Boolean) };
    target.click();
    return { ok: true };
  })()`);
  if (!result.ok) throw new Error(`Button not found: ${text}. Available: ${result.labels.join(" | ")}`);
  await settle();
}

async function goHome() {
  await evaluate("document.querySelector('button[aria-label=\"返回学生社团\"]')?.click() ?? [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === '学生社团')?.click(); true");
  await settle();
}

async function capture(filename) {
  await call("Page.bringToFront");
  const result = await call("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(resolve(filename), Buffer.from(result.data, "base64"));
}

await call("Runtime.enable");
await call("Log.enable");
await call("Page.enable");
await call("Emulation.setDeviceMetricsOverride", { width: 1920, height: 934, deviceScaleFactor: 1, mobile: false });
await evaluate("location.reload(); true");
await settle();
await evaluate("new Promise((resolve) => { const check = () => document.querySelector('h1') ? resolve(true) : setTimeout(check, 50); check(); })");

const checks = [];
checks.push({ name: "home-title", value: await evaluate("document.querySelector('h1')?.textContent") });
checks.push({ name: "home-club-rows", value: await evaluate("document.querySelectorAll('tbody tr').length") });
checks.push({ name: "top-task-count", value: await evaluate("document.querySelectorAll('.task-button').length") });
checks.push({ name: "second-level-pages", value: await evaluate("document.querySelectorAll('.detail-page, .modal, .rule-card').length") });
checks.push({ name: "unnamed-buttons", value: await evaluate("[...document.querySelectorAll('button')].filter((button) => !(button.textContent.trim() || button.getAttribute('aria-label'))).length") });
checks.push({ name: "unlabelled-inputs", value: await evaluate("[...document.querySelectorAll('input, select')].filter((field) => !(field.getAttribute('aria-label') || field.closest('label'))).length") });
await clickButton("更多筛选");
checks.push({ name: "advanced-filter-controls", value: await evaluate("document.querySelectorAll('.advanced-filters select').length") });
await clickButton("更多筛选");
await capture("qa-home.png");
await evaluate("document.querySelectorAll('.row-more-button')[0].click(); true");
await settle();
checks.push({ name: "active-club-actions", value: await evaluate("[...document.querySelectorAll('.row-more-menu button')].map((button) => button.textContent.trim())") });
checks.push({ name: "active-menu-layout", value: await evaluate("(() => { const menu = document.querySelector('.row-more-menu'); return { menu: menu?.getBoundingClientRect().toJSON(), buttons: [...menu.querySelectorAll('button')].map((button) => button.getBoundingClientRect().toJSON()) }; })()") });
await capture("qa-home-active-menu.png");
await evaluate("document.querySelectorAll('.row-more-button')[0].click(); true");
await settle();
await evaluate("document.querySelectorAll('.row-more-button')[2].click(); true");
await settle();
checks.push({ name: "early-ended-club-actions", value: await evaluate("[...document.querySelectorAll('.row-more-menu button')].map((button) => button.textContent.trim())") });
await capture("qa-home-early-ended-menu.png");
await evaluate("document.querySelectorAll('.row-more-button')[2].click(); true");
await settle();

await clickButton("社团审核", false);
checks.push({ name: "application-title", value: await evaluate("document.querySelector('h1')?.textContent") });
checks.push({ name: "pending-application-rows", value: await evaluate("document.querySelectorAll('tbody tr').length") });
await capture("qa-application-list.png");

await clickButton("结束申请", false);
checks.push({ name: "end-request-tab-selected", value: await evaluate("document.querySelector('[role=\"tab\"][aria-selected=\"true\"]')?.textContent.trim()") });
checks.push({ name: "pending-end-request-rows", value: await evaluate("document.querySelectorAll('tbody tr').length") });
await capture("qa-end-request-list.png");

await clickButton("延续申请", false);
checks.push({ name: "continuation-request-tab-selected", value: await evaluate("document.querySelector('[role=\"tab\"][aria-selected=\"true\"]')?.textContent.trim()") });
checks.push({ name: "pending-continuation-request-rows", value: await evaluate("document.querySelectorAll('tbody tr').length") });
await capture("qa-continuation-request-list.png");

await goHome();
await clickButton("社团学分审核", false);
checks.push({ name: "credit-title", value: await evaluate("document.querySelector('h1')?.textContent") });
checks.push({ name: "credit-club-filter", value: await evaluate("document.querySelectorAll('.select-field select')[1]?.selectedOptions[0]?.textContent") });
checks.push({ name: "pending-credit-rows", value: await evaluate("document.querySelectorAll('tbody tr').length") });
await capture("qa-credit-list.png");

await goHome();
await clickButton("配置");
checks.push({ name: "config-title", value: await evaluate("document.querySelector('h1')?.textContent") });
checks.push({ name: "config-items", value: await evaluate("document.querySelectorAll('.config-row').length") });
await capture("qa-config.png");

await goHome();
await evaluate(`(() => {
  const select = document.querySelector('.select-field select');
  select.value = "2025-2026学年第二学期";
  select.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
})()`);
await settle();
await evaluate("document.querySelector('.row-more-button').click(); true");
await settle();
checks.push({ name: "normally-ended-club-actions", value: await evaluate("[...document.querySelectorAll('.row-more-menu button')].map((button) => button.textContent.trim())") });
await evaluate("document.querySelector('.row-more-button').click(); true");
await settle();
await evaluate(`(() => {
  const select = document.querySelector('.select-field select');
  select.value = ${JSON.stringify("2026-2027学年第一学期")};
  select.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
})()`);
await settle();
await call("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
await settle();
checks.push({ name: "narrow-horizontal-overflow", value: await evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth") });
await capture("qa-home-1280.png");

console.log(JSON.stringify({ checks, consoleErrors }, null, 2));
socket.close();
