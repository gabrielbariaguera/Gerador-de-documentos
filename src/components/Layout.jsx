import { NavLink, Outlet } from "react-router-dom";
import {
    Archive,
    CalendarDays,
    FileText,
    FolderOpen,
    GraduationCap,
    Palette,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { aplicarTema, carregarTema, salvarTema, TEMA_PADRAO } from "../lib/theme.js";

const MENU = [
    { to: "/", label: "Transferência", icon: FileText, end: true },
    { to: "/abonada", label: "Abonada", icon: FileText },
    { to: "/eventos", label: "Eventos", icon: CalendarDays },
    { to: "/dispensa", label: "Dispensa", icon: FileText },
    { to: "/historico", label: "Histórico Escolar", icon: GraduationCap },
    { to: "/matricula", label: "Matrícula", icon: FileText },
    { to: "/funcionarios", label: "Funcionários", icon: Users },
    { to: "/arquivos", label: "Histórico de documentos", icon: Archive },
    { to: "/extras", label: "Documentos Extras", icon: FolderOpen }
];

function ThemePanel() {
    const [aberto, setAberto] = useState(false);
    const [tema, setTema] = useState(carregarTema);

    function atualizar(chave, valor) {
        const proximo = { ...tema, [chave]: valor };
        setTema(proximo);
        salvarTema(proximo);
    }

    return (
        <div className="relative">
            <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold"
                style={{ borderColor: "var(--app-border)", background: "var(--app-primary-light)", color: "var(--app-primary)" }}
                onClick={() => setAberto((v) => !v)}
            >
                <Palette size={14} />
                Cores
            </button>
            {aberto ? (
                <div className="absolute right-0 z-50 mt-2 w-72 rounded-[10px] border p-4 shadow-lg animate-fade-up" style={{ borderColor: "var(--app-border)", background: "var(--app-card)" }}>
                    <p className="mb-3 text-sm font-extrabold" style={{ color: "var(--app-primary)" }}>Personalizar cores</p>
                    {[
                        ["primary", "Cor principal"],
                        ["accent", "Cor de destaque"],
                        ["background", "Fundo"]
                    ].map(([chave, label]) => (
                        <label key={chave} className="mb-3 flex items-center justify-between gap-3 text-sm">
                            {label}
                            <input
                                type="color"
                                value={tema[chave]}
                                onChange={(e) => atualizar(chave, e.target.value)}
                                className="h-9 w-12 cursor-pointer rounded border bg-transparent"
                            />
                        </label>
                    ))}
                    <button
                        type="button"
                        className="btn-secondary w-full"
                        onClick={() => {
                            setTema(TEMA_PADRAO);
                            salvarTema(TEMA_PADRAO);
                        }}
                    >
                        Restaurar padrão
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default function Layout() {
    useEffect(() => {
        aplicarTema(carregarTema());
    }, []);

    return (
        <div className="grid h-screen w-screen grid-cols-[280px_1fr] grid-rows-[64px_1fr] overflow-hidden bg-white max-md:grid-cols-1 max-md:grid-rows-[auto_1fr]">
            <header className="col-span-2 flex items-center justify-between border-b-[3px] px-6" style={{ borderColor: "var(--app-accent)" }}>
                <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md text-white" style={{ background: "var(--app-primary)" }}>
                        <FileText size={18} />
                    </span>
                    <h1 className="text-lg font-extrabold tracking-tight" style={{ color: "var(--app-primary)" }}>
                        Sistema de Documentos
                    </h1>
                </div>
                <ThemePanel />
            </header>

            <aside className="flex flex-col overflow-y-auto animate-slide-in max-md:hidden" style={{ background: "var(--app-primary)", color: "var(--app-on-primary)" }}>
                <div className="flex items-center gap-3 border-b border-white/20 px-[18px] py-5">
                    <span className="grid h-[34px] w-[34px] place-items-center rounded-md" style={{ background: "var(--app-accent)" }}>
                        <Archive size={16} />
                    </span>
                    <span className="text-[13px] font-bold uppercase tracking-[0.08em]">Menu</span>
                </div>
                <nav className="flex flex-col gap-1 px-2.5 py-3">
                    {MENU.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-md px-3 py-3 text-sm transition duration-200 hover:translate-x-0.5 ${isActive ? "font-bold" : "font-medium"}`
                            }
                            style={({ isActive }) => ({
                                background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
                                borderLeft: isActive ? "3px solid #fff" : "3px solid transparent"
                            })}
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto border-t border-white/20 px-[18px] py-5 text-xs text-white/75">
                    v3.0.0 —{" "}
                    <a className="text-white underline-offset-2 hover:underline" href="https://github.com/gabrielbariaguera" target="_blank" rel="noreferrer">
                        Gabriel Aguera Baria
                    </a>
                </div>
            </aside>

            <main className="overflow-y-auto p-7 animate-fade-up max-md:p-4" style={{ background: "var(--app-bg)" }}>
                <Outlet />
            </main>
        </div>
    );
}
