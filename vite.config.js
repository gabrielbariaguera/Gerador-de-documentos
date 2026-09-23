import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        outDir: "spa",
        emptyOutDir: true
    },
    server: {
        port: 5173,
        proxy: {
            "/api": "http://localhost:8000",
            "/modelos": "http://localhost:8000",
            "/extras": "http://localhost:8000"
        }
    }
});
