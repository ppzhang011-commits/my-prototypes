#!/usr/bin/env node
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

// 原型生成器会拒绝从外部项目读取 dist/。将当前构建资源复制到项目根目录的白名单路径，
// 并生成稳定入口，供 /ext/<projectId>/index.html 直接加载。
const builtAssets = path.join(dist, "client", "assets");
const prototypeAssets = path.join(root, "prototype-assets");
const assetNames = readdirSync(builtAssets);
// emptyOutDir 为 false 时会保留旧构建资源。不能按目录顺序挑第一个 main-*，
// 必须沿当前 index.html 的入口解析出本次构建实际引用的运行时资源。
const builtIndex = readFileSync(index, "utf8");
const entryFile = builtIndex.match(/src="\.\/assets\/([^\"]+\.js)"/)?.[1];
const entrySource = entryFile ? readFileSync(path.join(builtAssets, entryFile), "utf8") : "";
const runtimeScript = entrySource.match(/main-[A-Za-z0-9_-]+\.js/)?.[0];
const runtimeStyle = entrySource.match(/main-[A-Za-z0-9_-]+\.css/)?.[0];
if (!runtimeScript || !runtimeStyle) throw new Error("Missing built prototype runtime assets");
mkdirSync(prototypeAssets, { recursive: true });
for (const asset of assetNames) cpSync(path.join(builtAssets, asset), path.join(prototypeAssets, asset), { recursive: true });
writeFileSync(
  path.join(prototypeAssets, "runtime.js"),
  `const stylesheet = document.createElement("link");\nstylesheet.rel = "stylesheet";\nstylesheet.href = new URL("./${runtimeStyle}", import.meta.url).href;\ndocument.head.appendChild(stylesheet);\nimport("./${runtimeScript}");\n`,
  "utf8",
);

console.log("Prepared Sites build and workbench runtime assets");
