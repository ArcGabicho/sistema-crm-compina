"use client";

import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { UsersRound, UserPen, UserRoundCheck, UserRoundPlus, LoaderCircle } from 'lucide-react';

import PendingClients from './PendingClients';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../utils/firebase";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
    const [totalClients, setTotalClients] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTotalClients = async () => {
        const cached = localStorage.getItem("totalClientsCache");
        if (cached) {
            const { value, timestamp } = JSON.parse(cached);
            const now = Date.now();
            // Si fue guardado hace menos de 24 horas, usa el valor cacheado
            if (now - timestamp < 24 * 60 * 60 * 1000) {
                setTotalClients(value);
                setLoading(false);
                return;
            }
        }
        // Si no hay cache o ya pasó un día, consulta Firestore
        const db = getFirestore(app);
        const snapshot = await getDocs(collection(db, "clientes"));
        setTotalClients(snapshot.size);
        setLoading(false);
        localStorage.setItem(
            "totalClientsCache",
            JSON.stringify({ value: snapshot.size, timestamp: Date.now() })
        );
    };
    fetchTotalClients();
    }, []);

    const stats = [
        { icon: <UsersRound />, title: "Clientes totales", value: totalClients, loading },
        { icon: <UserRoundCheck />, title: "Clientes Cotizados", value: 1000, loading: false },
        { icon: <UserPen />, title: "Clientes Pendientes", value: 2000, loading: false },
        { icon: <UserRoundPlus />, title: "Clientes Probables", value: 3000, loading: false },
    ];

    const chartData = {
        labels: stats.map(item => item.title),
        datasets: [
            {
                label: 'Clientes',
                data: stats.map(item => item.value),
                backgroundColor: [
                    '#60a5fa', '#34d399', '#fbbf24', '#f87171'
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Resumen de Clientes' },
        },
    };
    
    return (
        <section className='flex'>
            <div className='flex flex-col'>
                <h1 className="text-3xl font-bold">
                    Inicio
                </h1>
                <div className="flex flex-row gap-6 my-8">
                    {stats.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center bg-white rounded-xl shadow-md px-6 py-4 min-w-[160px] border border-gray-100"
                        >
                            <div className="mb-2 text-yellow-500">{item.icon}</div>
                            <h6 className="text-sm font-semibold text-gray-600">{item.title}</h6>
                            <span className="text-xl font-bold text-gray-800">
                                {item.loading
                                    ? <LoaderCircle className="mt-2 size-5 animate-spin" />
                                    : item.value}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="w-full h-64 lg:h-85 mt-6 overflow-x-auto">
                    <Bar data={chartData} options={chartOptions} /> 
                </div>
            </div>
            <div className="flex flex-col mx-auto">
                <PendingClients />
            </div>
        </section>
    )
}