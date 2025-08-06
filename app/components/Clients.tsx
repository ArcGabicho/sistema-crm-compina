"use client";

import { getFirestore, collection, getDocs, query, orderBy, limit, startAfter, startAt, DocumentData, QueryDocumentSnapshot, } from "firebase/firestore";
import { app } from "../utils/firebase";
import { useEffect, useState } from "react";
import { doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { Pencil, Trash2, X, UserPlus, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  const [editCliente, setEditCliente] = useState<Cliente | null>(null);
  const [editForm, setEditForm] = useState<Partial<Cliente>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Cliente>>({
    nombre: "",
    empresa: "",
    etapa: "",
    tipo_cliente: "",
    fecha: "",
  });

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

  // Eliminar cliente
  const handleEliminar = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    const db = getFirestore(app);
    await deleteDoc(doc(db, "clientes", id));
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  // Abrir modal de edición
  const handleEditar = (cliente: Cliente) => {
    setEditCliente(cliente);
    setEditForm(cliente);
  };

  // Guardar cambios de edición
  const handleGuardarEdicion = async () => {
    if (!editCliente) return;
    const db = getFirestore(app);
    await updateDoc(doc(db, "clientes", editCliente.id), {
      ...editForm,
    });
    setClientes((prev) =>
      prev.map((c) => (c.id === editCliente.id ? { ...c, ...editForm } : c))
    );
    setEditCliente(null);
    setEditForm({});
  };

  // Agregar cliente
  const handleAgregarCliente = async () => {
    const db = getFirestore(app);
    const docRef = await addDoc(collection(db, "clientes"), {
      ...addForm,
    });
    setClientes((prev) => [
      { id: docRef.id, ...addForm },
      ...prev,
    ]);
    setShowAddModal(false);
    setAddForm({
      nombre: "",
      empresa: "",
      etapa: "",
      tipo_cliente: "",
      fecha: "",
    });
  };

  // Exportar a Excel
  const handleExportarExcel = () => {
    // Solo exporta los datos filtrados que se muestran en la tabla
    const data = clientesFiltrados.map((c) => ({
      ID: c.id,
      Nombre: c.nombre || "",
      Empresa: c.empresa || "",
      Etapa: c.etapa || "",
      Tipo: c.tipo_cliente || "",
      Fecha: c.fecha || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "clientes.xlsx");
  };

  return (
    <section className="w-full h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Listado de Clientes</h2>

      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition font-semibold"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={18} /> Agregar Cliente
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition font-semibold"
          onClick={handleExportarExcel}
        >
          <FileDown size={18} /> Exportar a Excel
        </button>
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
          <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">ID</th>
                <th className="p-3 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">Nombre</th>
                <th className="p-3 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">Empresa</th>
                <th className="p-3 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">Etapa</th>
                <th className="p-3 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">Tipo</th>
                <th className="p-3 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">Fecha</th>
                <th className="p-3 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente, idx) => (
                <tr
                  key={cliente.id}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="p-3 border-b border-gray-100 text-gray-900 font-mono">{cliente.id}</td>
                  <td className="p-3 border-b border-gray-100 text-gray-800">{cliente.nombre || "—"}</td>
                  <td className="p-3 border-b border-gray-100 text-gray-800">{cliente.empresa || "—"}</td>
                  <td className="p-3 border-b border-gray-100 text-gray-700">{cliente.etapa || "—"}</td>
                  <td className="p-3 border-b border-gray-100 text-gray-700">{cliente.tipo_cliente || "—"}</td>
                  <td className="p-3 border-b border-gray-100 text-gray-700">{cliente.fecha || "—"}</td>
                  <td className="p-3 border-b border-gray-100">
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-1 px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition text-xs shadow focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        onClick={() => handleEditar(cliente)}
                        title="Editar"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                      <button
                        className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs shadow focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => handleEliminar(cliente.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition disabled:opacity-50"
              onClick={() => fetchClientes("prev")}
              disabled={backStack.length === 0}
            >
              Anterior
            </button>
            <span className="text-gray-700 font-semibold">Página {pagina}</span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition disabled:opacity-50"
              onClick={() => fetchClientes("next")}
              disabled={clientes.length < PAGE_SIZE}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Modal de edición */}
      {editCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"></div>
          <div className="relative bg-white rounded-xl shadow-2xl p-8 min-w-[340px] w-full max-w-md mx-4 animate-fade-in-up">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setEditCliente(null)}
              title="Cerrar"
            >
              <X size={22} />
            </button>
            <div className="mb-4 flex items-center gap-2">
              <Pencil className="text-yellow-500" size={22} />
              <h3 className="text-xl font-bold text-gray-700">Editar Cliente</h3>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleGuardarEdicion();
              }}
              className="flex flex-col gap-4"
            >
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-200"
                placeholder="Nombre"
                value={editForm.nombre || ""}
                onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-200"
                placeholder="Empresa"
                value={editForm.empresa || ""}
                onChange={e => setEditForm(f => ({ ...f, empresa: e.target.value }))}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-200"
                placeholder="Etapa"
                value={editForm.etapa || ""}
                onChange={e => setEditForm(f => ({ ...f, etapa: e.target.value }))}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-200"
                placeholder="Tipo de cliente"
                value={editForm.tipo_cliente || ""}
                onChange={e => setEditForm(f => ({ ...f, tipo_cliente: e.target.value }))}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-200"
                placeholder="Fecha"
                value={editForm.fecha || ""}
                onChange={e => setEditForm(f => ({ ...f, fecha: e.target.value }))}
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  onClick={() => setEditCliente(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de agregar cliente */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"></div>
          <div className="relative bg-white rounded-xl shadow-2xl p-8 min-w-[340px] w-full max-w-md mx-4 animate-fade-in-up">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowAddModal(false)}
              title="Cerrar"
            >
              <X size={22} />
            </button>
            <div className="mb-4 flex items-center gap-2">
              <UserPlus className="text-green-500" size={22} />
              <h3 className="text-xl font-bold text-gray-700">Agregar Cliente</h3>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAgregarCliente();
              }}
              className="flex flex-col gap-4"
            >
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-green-200"
                placeholder="Nombre"
                value={addForm.nombre || ""}
                onChange={e => setAddForm(f => ({ ...f, nombre: e.target.value }))}
                required
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-green-200"
                placeholder="Empresa"
                value={addForm.empresa || ""}
                onChange={e => setAddForm(f => ({ ...f, empresa: e.target.value }))}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-green-200"
                placeholder="Etapa"
                value={addForm.etapa || ""}
                onChange={e => setAddForm(f => ({ ...f, etapa: e.target.value }))}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-green-200"
                placeholder="Tipo de cliente"
                value={addForm.tipo_cliente || ""}
                onChange={e => setAddForm(f => ({ ...f, tipo_cliente: e.target.value }))}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-green-200"
                placeholder="Fecha"
                value={addForm.fecha || ""}
                onChange={e => setAddForm(f => ({ ...f, fecha: e.target.value }))}
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

/* Animaciones TailwindCSS (agrega en tu CSS global si usas Tailwind)
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.2s ease;
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.25s cubic-bezier(.39,.575,.565,1) both;
  }
  @keyframes fadeIn {
    from { opacity: 0 }
    to { opacity: 1 }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px);}
    to { opacity: 1; transform: translateY(0);}
  }
}
*/