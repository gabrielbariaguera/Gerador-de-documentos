import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const api = useMemo(() => ({
        toast(message, type = "success") {
            const id = crypto.randomUUID();
            setToasts((atual) => [...atual, { id, message, type }]);
            setTimeout(() => {
                setToasts((atual) => atual.filter((item) => item.id !== id));
            }, 3200);
        }
    }), []);

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(420px,calc(100%-2rem))] flex-col gap-2">
                {toasts.map((item) => (
                    <div
                        key={item.id}
                        className="pointer-events-auto rounded-[10px] border bg-white px-4 py-3 text-sm shadow-lg animate-fade-up"
                        style={{ borderLeft: `4px solid ${item.type === "success" ? "var(--app-primary)" : "var(--app-accent)"}` }}
                    >
                        {item.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
