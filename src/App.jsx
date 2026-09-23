import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/Toast.jsx";
import Layout from "./components/Layout.jsx";
import Transferencia from "./pages/Transferencia.jsx";
import Abonada from "./pages/Abonada.jsx";
import Eventos from "./pages/Eventos.jsx";
import Dispensa from "./pages/Dispensa.jsx";
import Historico from "./pages/Historico.jsx";
import Matricula from "./pages/Matricula.jsx";
import Funcionarios from "./pages/Funcionarios.jsx";
import Colaborativo from "./pages/Colaborativo.jsx";
import Medicamentos from "./pages/Medicamentos.jsx";
import Arquivos from "./pages/Arquivos.jsx";
import Extras from "./pages/Extras.jsx";

export default function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Transferencia />} />
                        <Route path="/abonada" element={<Abonada />} />
                        <Route path="/eventos" element={<Eventos />} />
                        <Route path="/dispensa" element={<Dispensa />} />
                        <Route path="/historico" element={<Historico />} />
                        <Route path="/matricula" element={<Matricula />} />
                        <Route path="/funcionarios" element={<Funcionarios />} />
                        <Route path="/colaborativo" element={<Colaborativo />} />
                        <Route path="/medicamentos" element={<Medicamentos />} />
                        <Route path="/arquivos" element={<Arquivos />} />
                        <Route path="/extras" element={<Extras />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}
