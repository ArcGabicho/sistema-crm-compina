"use client";

import { useState } from "react";

import Sidebar from "../components/Sidebar";

import Inicio from "../pages/Home";
import Clientes from "../pages/Clients";
import Reports from "../pages/Reports";
import Inventory from "../pages/Inventory";

export default function DashboardPage() {
    const [modulo, setModulo] = useState("inicio");

    function renderModulo() {
        switch (modulo) {
            case "inicio":
                return <Inicio />;
            case "clientes":
                return <Clientes />;
            case "reportes":
                return <Reports />;
            case "inventario":
                return <Inventory />;
            default:
                return <Inicio />;
        }
    }

    return (
        <section className="flex min-h-screen max-h-screen overflow-hidden bg-linear-to-br from-yellow-50 via-white to-gray-100">
            <Sidebar onSelectModulo={setModulo} />
            <div className="flex-1 flex flex-col items-center justify-start py-4 px-4 md:py-12 md:px-8 overflow-hidden pb-20 md:pb-0">
                <div className="w-full bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 h-full overflow-scroll md:overflow-hidden">
                    {renderModulo()}
                </div>
            </div>
        </section>
    );
}