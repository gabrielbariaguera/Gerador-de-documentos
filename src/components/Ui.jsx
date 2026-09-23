export function Card({ icon: Icon, title, children, delay = 0 }) {
    return (
        <section className="card-app mb-4 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
            <header className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: "var(--app-border)" }}>
                {Icon ? (
                    <span className="grid h-9 w-9 place-items-center rounded-md text-white" style={{ background: "var(--app-primary)" }}>
                        <Icon size={16} />
                    </span>
                ) : null}
                <h3 className="text-base font-extrabold" style={{ color: "var(--app-primary)" }}>{title}</h3>
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

export function Field({ label, children, full }) {
    return (
        <label className={`mb-4 block ${full ? "md:col-span-2 lg:col-span-3" : ""}`}>
            <span className="mb-2 block text-sm font-bold">{label}</span>
            {children}
        </label>
    );
}

export function PageHeader({ title, description }) {
    return (
        <header className="mb-5 animate-fade-up">
            <h2 className="mb-2 text-[28px] font-extrabold leading-tight tracking-tight" style={{ color: "var(--app-primary)" }}>
                {title}
            </h2>
            <div className="mb-3 h-[3px] w-[72px] rounded-full" style={{ background: "var(--app-accent)" }} />
            <p className="max-w-[62ch] text-[15px]" style={{ color: "var(--app-muted)" }}>{description}</p>
        </header>
    );
}

export function Actions({ onClear, onSubmit, loading }) {
    return (
        <div className="mt-6 mb-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" className="btn-secondary" onClick={onClear}>Limpar campos</button>
            <button type="button" className="btn-primary disabled:opacity-70" onClick={onSubmit} disabled={loading}>
                {loading ? "Gerando..." : "Gerar documento"}
            </button>
        </div>
    );
}
