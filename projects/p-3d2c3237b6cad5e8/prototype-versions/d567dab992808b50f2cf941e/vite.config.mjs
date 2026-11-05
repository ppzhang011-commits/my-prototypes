import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // 原型生成器会在 /ext/<projectId>/ 下嵌入页面，构建资源必须使用相对路径。
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
  server: {
    port: 4178,
    host: "0.0.0.0",
    strictPort: true,
    fs: { allow: ["../.."] },
  },
  preview: { port: 4178, host: "0.0.0.0", strictPort: true },
});
