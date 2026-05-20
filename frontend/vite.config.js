import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    // Bundle visualizer — generates dist/stats.html on every build.
    // Open it locally to find large modules and tree-shaking opportunities.
    visualizer({
      filename:  "dist/stats.html",
      gzipSize:  true,
      brotliSize: true,
      open:      false, // Don't auto-open in CI
    }),
  ],
  build: {
    // Show compressed (gzip) sizes alongside raw sizes in build output
    reportCompressedSize: true,
    // Warn when any single chunk exceeds 200KB (uncompressed)
    chunkSizeWarningLimit: 200,
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          icons:  ["lucide-react"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
    strictPort: true
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    css: false,
  },
});
