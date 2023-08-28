import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://shane-jung.github.io/sophia-food-blog/",
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      external: ["nock", "mock-aws-s3", "aws-sdk"],

      // overwrite default .html entry
      input: "./src/main.tsx",
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {},
});
