import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/react-games-gallery/#",
  build: {
    target: "ES2022",
    outDir: "dist/",
    assetsDir: "./",
  },
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
      "@shared": `${path.resolve(__dirname, "src/shared")}/`,
      "@core": `${path.resolve(__dirname, "src/shared/core")}/`,
      "@ui": `${path.resolve(__dirname, "src/shared/ui")}/`,
      "@pages": `${path.resolve(__dirname, "src/pages")}/`,
      "@router": `${path.resolve(__dirname, "src/router")}/`,
      "@styles": `${path.resolve(__dirname, `src/styles`)}/`,
    },
  },
  server: {
    host: true,
  },
  // esbuild: {
  //   logOverride: {
  //     "this-is-undefined-in-esm": "silent",
  //   },
  // },
});
