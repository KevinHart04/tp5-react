import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Configuración principal de Vite.
 * Se exponen los puertos para Docker y se fuerza el polling para el HMR.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Fundamental: expone Vite a la red de Docker
    port: 5173,
    watch: {
      usePolling: true, // Evita que el auto-recargado se trabe usando volúmenes
    },
  },
});
