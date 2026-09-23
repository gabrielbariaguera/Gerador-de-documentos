import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { aplicarTema, carregarTema } from "./lib/theme.js";
import "./index.css";

aplicarTema(carregarTema());

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
