import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
    // Headers de seguridad para desarrollo
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  },
  // Build optimizations con seguridad
  build: {
    // Generar source maps solo en desarrollo
    sourcemap: false,
    // Usar esbuild para minificación (más rápido y viene incluido)
    minify: "esbuild",
    // Dividir chunks para mejor caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/auth"],
        },
      },
    },
  },
  // Eliminar console y debugger en producción
  esbuild: {
    drop: ["console", "debugger"],
  },
});
