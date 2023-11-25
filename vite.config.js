import {fileURLToPath, URL} from "node:url";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/server": {
        target: "서버주소",
        changeOrigin: "true",
        rewrite: (path) => path.replace(/^\/server/, ""),
      },
    },
  },
});
