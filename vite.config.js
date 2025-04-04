import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/react-map-gl-playground/", // https://vite.dev/guide/static-deploy#github-pages
});
