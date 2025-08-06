"use client";

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Inicio from "../components/Home";
import Clientes from "../components/Clients";
import Data from "../components/Data";
import Reports from "../components/Reports";
import RPA from "../components/RPA";
import Autor from "../components/Author";

export default function DashboardPage() {
    const [modulo, setModulo] = useState("inicio");

    function renderModulo() {
        switch (modulo) {
            case "inicio":
                return <Inicio />;
            case "clientes":
                return <Clientes />;
            case "data":
                return <Data />;
            case "reportes":
                return <Reports />;
            case "automatizacion":
                return <RPA />;
            case "autor":
                return <Autor />;
            default:
                return <Inicio />;
        }
    }

    return (
        <section className="flex min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-gray-100">
            <Sidebar onSelectModulo={setModulo} />
            <div className="flex-1 flex flex-col items-center justify-start py-12 px-8 overflow-hidden">
                <div className="w-full bg-white rounded-2xl shadow-lg p-8 h-full overflow-hidden">
                    {renderModulo()}
                </div>
            </div>
        </section>
    );
}