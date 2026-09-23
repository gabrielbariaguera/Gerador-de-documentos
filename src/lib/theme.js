export const TEMA_PADRAO = {
    primary: "#127872",
    accent: "#0b4f4b",
    background: "#f3faf8"
};

const CHAVE = "tema-cores-documentos";

function hexParaRgb(hex) {
    const limpo = hex.replace("#", "").trim();
    const normalizado = limpo.length === 3
        ? limpo.split("").map((c) => c + c).join("")
        : limpo.padEnd(6, "0").slice(0, 6);
    return {
        r: parseInt(normalizado.slice(0, 2), 16),
        g: parseInt(normalizado.slice(2, 4), 16),
        b: parseInt(normalizado.slice(4, 6), 16)
    };
}

function rgbParaHex({ r, g, b }) {
    const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function misturar(hex, alvo, quantidade) {
    const a = hexParaRgb(hex);
    const b = hexParaRgb(alvo);
    return rgbParaHex({
        r: a.r + (b.r - a.r) * quantidade,
        g: a.g + (b.g - a.g) * quantidade,
        b: a.b + (b.b - a.b) * quantidade
    });
}

function luminancia(hex) {
    const { r, g, b } = hexParaRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function carregarTema() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
        return { ...TEMA_PADRAO, ...salvo };
    } catch {
        return { ...TEMA_PADRAO };
    }
}

export function salvarTema(tema) {
    localStorage.setItem(CHAVE, JSON.stringify(tema));
    aplicarTema(tema);
}

export function aplicarTema(tema) {
    const cores = { ...TEMA_PADRAO, ...tema };
    const root = document.documentElement;
    const textoSobrePrimaria = luminancia(cores.primary) > 0.62 ? "#14312e" : "#ffffff";
    const texto = luminancia(cores.background) > 0.55 ? misturar(cores.primary, "#000000", 0.55) : "#f8fafc";

    root.style.setProperty("--app-primary", cores.primary);
    root.style.setProperty("--app-primary-hover", misturar(cores.primary, "#000000", 0.18));
    root.style.setProperty("--app-primary-light", misturar(cores.primary, "#ffffff", 0.88));
    root.style.setProperty("--app-accent", cores.accent);
    root.style.setProperty("--app-accent-hover", misturar(cores.accent, "#000000", 0.16));
    root.style.setProperty("--app-bg", cores.background);
    root.style.setProperty("--app-card", "#ffffff");
    root.style.setProperty("--app-text", texto);
    root.style.setProperty("--app-muted", misturar(texto, cores.background, 0.42));
    root.style.setProperty("--app-border", misturar(cores.primary, "#ffffff", 0.72));
    root.style.setProperty("--app-sidebar", cores.primary);
    root.style.setProperty("--app-sidebar-border", misturar(cores.primary, "#000000", 0.35));
    root.style.setProperty("--app-on-primary", textoSobrePrimaria);
}
