"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, limit } from "firebase/firestore";
import { app } from "../utils/firebase";

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

  useEffect(() => {
    const fetchClients = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
      const cachedData = localStorage.getItem(CACHE_KEY);

      if (cachedDate && cachedData && isToday(cachedDate)) {
        // Usar datos en caché
        setClients(JSON.parse(cachedData));
        return;
      }

      // Consultar Firestore si no hay caché válido
      const db = getFirestore(app);
      const q = query(
        collection(db, "clientes"),
        where("etapa", "in", ["Retomar Contacto", "Retomar", "retomar"]),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const clientsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];

      // Guardar en caché local
      localStorage.setItem(CACHE_KEY, JSON.stringify(clientsList));
      localStorage.setItem(CACHE_DATE_KEY, today);

      setClients(clientsList);
    };

    fetchClients();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Clientes Pendientes</h2>
      {clients.length === 0 ? (
        <p>No hay clientes pendientes.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Empresa</th>
              <th className="border px-4 py-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="text-center">
                <td className="border px-4 py-2">{client.empresa || "—"}</td>
                <td className="border px-4 py-2">{client.telefono || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}