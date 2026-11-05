import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const prototypePages = [
  ["parent-plaza", "plaza"],
  ["parent-report", "report"],
  ["parent-propose-center", "propose-center"],
  ["parent-propose-form", "propose-form"],
  ["parent-my-applications", "my-applications"],
  ["parent-club-detail", "club-detail"],
  ["parent-club-moments", "club-moments"],
];

function prototypeStatePages() {
  return {
    name: "prototype-state-pages",
    apply: "build",
    async closeBundle() {
      const output = path.resolve(process.cwd(), "prototype-build");
      const shell = await readFile(path.join(output, "index.html"), "utf8");
      await Promise.all(prototypePages.map(async ([pageId, stateId]) => {
        const boot = `<script>window.__PROTO_INITIAL_STATE__=${JSON.stringify(stateId)};document.documentElement.dataset.protoPage=${JSON.stringify(pageId)};document.documentElement.dataset.protoState=${JSON.stringify(stateId)};<\/script>`;
        await writeFile(path.join(output, `${stateId}.html`), shell.replace("<head>", `<head>${boot}`), "utf8");
      }));
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), prototypeStatePages()],
  build: { outDir: "prototype-build" },
  server: {
    port: 4178,
    host: "0.0.0.0",
    strictPort: true,
    fs: { allow: ["../.."] },
  },
  preview: { port: 4178, host: "0.0.0.0", strictPort: true },
});
