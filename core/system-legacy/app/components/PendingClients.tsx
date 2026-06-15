"use client";

import { useEffect, useState } from "react";

interface Client {
  id: string;
  nombre?: string;
  apellidos?: string;
  empresa?: string;
  razon_social?: string;
  etapa?: string;
  cargo?: string;
  distrito?: string;
  provincia?: string;
  telefono?: string;
}

const CACHE_KEY = "cachedClients";
const CACHE_DATE_KEY = "cachedClientsDate";

function isToday(dateStr: string) {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
}

export default function PendingClients() {
  const [clients, setClients] = useState<Client[]>([]);

  // Lógica de Firebase eliminada. Puedes cargar datos de otra fuente aquí.
  // Demo: valores estáticos
  useEffect(() => {
    setClients([
      { id: '1', empresa: 'Empresa Demo 1', telefono: '999-111-222' },
      { id: '2', empresa: 'Empresa Demo 2', telefono: '999-333-444' },
    ]);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg px-8 py-6 min-w-85 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Clientes Pendientes</h2>
      {clients.length === 0 ? (
        <p className="text-gray-500">No hay clientes pendientes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border-separate border-spacing-0">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3 text-left text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                  Empresa
                </th>
                <th className="px-5 py-3 text-left text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                  Teléfono
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, idx) => (
                <tr
                  key={client.id}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="px-5 py-3 border-b border-gray-100 text-gray-900 whitespace-nowrap font-medium">
                    {client.empresa || "—"}
                  </td>
                  <td className="px-5 py-3 border-b border-gray-100 text-gray-900 whitespace-nowrap">
                    {client.telefono || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}