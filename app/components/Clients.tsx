"use client";

import { getFirestore, collection, getDocs, query, orderBy, limit, startAfter, startAt, DocumentData, QueryDocumentSnapshot, } from "firebase/firestore";
import { app } from "../utils/firebase";
import { useEffect, useState } from "react";

interface Cliente {
  id: string;
  nombre?: string;
  empresa?: string;
  etapa?: string;
  tipo_cliente?: string;
  fecha?: string;
}

export default function Clients() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [backStack, setBackStack] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEtapa, setFiltroEtapa] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);

  const PAGE_SIZE = 10;

  const fetchClientes = async (direction: "next" | "prev" | "start") => {
    setLoading(true);
    const db = getFirestore(app);
    let q;

    if (direction === "start") {
      q = query(collection(db, "clientes"), orderBy("nombre"), limit(PAGE_SIZE));
    } else if (direction === "next" && lastDoc) {
      q = query(collection(db, "clientes"), orderBy("nombre"), startAfter(lastDoc), limit(PAGE_SIZE));
    } else if (direction === "prev" && firstDoc) {
      q = query(collection(db, "clientes"), orderBy("nombre"), startAt(firstDoc), limit(PAGE_SIZE));
    } else {
      return;
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const clientesPage = docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Cliente[];

    setClientes(clientesPage);
    setFirstDoc(docs[0]);
    setLastDoc(docs[docs.length - 1]);

    if (direction === "next" && firstDoc) {
      setBackStack((prev) => [...prev, firstDoc]);
      setPagina((prev) => prev + 1);
    }

    if (direction === "prev") {
      setBackStack((prev) => prev.slice(0, -1));
      setPagina((prev) => Math.max(1, prev - 1));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchClientes("start");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBusqueda = (cliente: Cliente) => {
    const texto = busqueda.toLowerCase();
    return (
      cliente.nombre?.toLowerCase().includes(texto) ||
      cliente.empresa?.toLowerCase().includes(texto)
    );
  };

  const handleFiltro = (cliente: Cliente) => {
    if (filtroEtapa && cliente.etapa !== filtroEtapa) return false;
    if (filtroTipo && cliente.tipo_cliente !== filtroTipo) return false;
    return true;
  };

  const clientesFiltrados = clientes.filter(handleBusqueda).filter(handleFiltro);

  return (
    <section className="w-full h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Listado de Clientes</h2>

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nombre o empresa"
          className="border p-2 rounded-md w-64"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border p-2 rounded-md"
          value={filtroEtapa}
          onChange={(e) => setFiltroEtapa(e.target.value)}
        >
          <option value="">Todas las etapas</option>
          <option value="Retomar Contacto">Retomar Contacto</option>
          <option value="Contacto Inicial-1">Contacto Inicial-1</option>
          <option value="Finalizado">Finalizado</option>
        </select>
        <select
          className="border p-2 rounded-md"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="Prospecto">Prospecto</option>
          <option value="Frecuentes">Frecuentes</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Empresa</th>
                <th className="p-2 border">Etapa</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-yellow-50">
                  <td className="p-2 border">{cliente.id}</td>
                  <td className="p-2 border">{cliente.nombre || "—"}</td>
                  <td className="p-2 border">{cliente.empresa || "—"}</td>
                  <td className="p-2 border">{cliente.etapa || "—"}</td>
                  <td className="p-2 border">{cliente.tipo_cliente || "—"}</td>
                  <td className="p-2 border">{cliente.fecha || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => fetchClientes("prev")}
              disabled={backStack.length === 0}
            >
              Anterior
            </button>
            <span className="text-gray-700">Página {pagina}</span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => fetchClientes("next")}
              disabled={clientes.length < PAGE_SIZE}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}