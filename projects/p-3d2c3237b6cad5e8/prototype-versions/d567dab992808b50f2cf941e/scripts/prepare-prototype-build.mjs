#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = path.join(root, "dist", "client");
const index = path.join(client, "index.html");
const builtAssets = path.join(client, "assets");
const runtimeAssets = path.join(root, "assets");

if (!existsSync(index) || !existsSync(builtAssets)) {
  throw new Error("Missing parent prototype build output");
}

const builtIndex = readFileSync(index, "utf8");
const entryFile = builtIndex.match(/src="\.\/assets\/([^\"]+\.js)"/)?.[1];
const entrySource = entryFile ? readFileSync(path.join(builtAssets, entryFile), "utf8") : "";
const runtimeScript = entrySource.match(/main-[A-Za-z0-9_-]+\.js/)?.[0];
const runtimeStyle = entrySource.match(/main-[A-Za-z0-9_-]+\.css/)?.[0];
if (!runtimeScript || !runtimeStyle) {
  throw new Error("Missing built parent prototype runtime assets");
}

rmSync(runtimeAssets, { recursive: true, force: true });
mkdirSync(runtimeAssets, { recursive: true });
cpSync(builtAssets, runtimeAssets, { recursive: true });
writeFileSync(
  path.join(runtimeAssets, "runtime.js"),
  `const stylesheet = document.createElement("link");\nstylesheet.rel = "stylesheet";\nstylesheet.href = new URL("./${runtimeStyle}", import.meta.url).href;\ndocument.head.appendChild(stylesheet);\nimport("./${runtimeScript}");\n`,
  "utf8",
);

console.log("Prepared parent prototype workbench runtime assets");
