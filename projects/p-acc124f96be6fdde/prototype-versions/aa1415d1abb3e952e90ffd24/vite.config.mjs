import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  // 原型生成器会把构建产物嵌在 /ext/<projectId>/ 下预览。
  // 使用相对资源路径，避免 /assets/* 被错误请求到生成器自身的根目录。
  base: "./",
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        "club-info": resolve(import.meta.dirname, "club-info.html"),
        "club-members": resolve(import.meta.dirname, "club-members.html"),
        "club-activities": resolve(import.meta.dirname, "club-activities.html"),
        "club-showcase": resolve(import.meta.dirname, "club-showcase.html"),
        "club-credits": resolve(import.meta.dirname, "club-credits.html"),
        "club-history": resolve(import.meta.dirname, "club-history.html"),
        analysis: resolve(import.meta.dirname, "analysis.html"),
        applications: resolve(import.meta.dirname, "applications.html"),
        "application-reviews": resolve(import.meta.dirname, "application-reviews.html"),
        "end-request-reviews": resolve(import.meta.dirname, "end-request-reviews.html"),
        "continuation-request-reviews": resolve(import.meta.dirname, "continuation-request-reviews.html"),
        "application-review": resolve(import.meta.dirname, "application-review.html"),
        "end-request-review": resolve(import.meta.dirname, "end-request-review.html"),
        "continuation-request-review": resolve(import.meta.dirname, "continuation-request-review.html"),
        credits: resolve(import.meta.dirname, "credits.html"),
        "credit-review": resolve(import.meta.dirname, "credit-review.html"),
        config: resolve(import.meta.dirname, "config.html"),
        "basic-settings": resolve(import.meta.dirname, "basic-settings.html"),
        "basic-settings-edit": resolve(import.meta.dirname, "basic-settings-edit.html"),
        "activity-notice": resolve(import.meta.dirname, "activity-notice.html"),
        "form-settings": resolve(import.meta.dirname, "form-settings.html"),
        "category-settings": resolve(import.meta.dirname, "category-settings.html"),
        "credit-rules": resolve(import.meta.dirname, "credit-rules.html"),
        "proxy-application": resolve(import.meta.dirname, "proxy-application.html"),
      },
    },
    // 该目录已被原型生成器登记，.prototype/ 中保存页面需求与标注。
    // 不清空输出目录，避免构建过程误删这些元数据。
    emptyOutDir: false,
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
