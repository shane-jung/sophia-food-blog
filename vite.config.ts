import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "sophia-food-blog/",
  plugins: [react()],
  build: {
    outDir: "public",
    rollupOptions: {
      external: ["nock", "mock-aws-s3", "aws-sdk"],

      // overwrite default .html entry
      input: "./src/client/main.tsx",
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
