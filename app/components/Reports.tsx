import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { app } from "../utils/firebase";
import { LoaderCircle } from "lucide-react";
import jsPDF from "jspdf";
import { Trash2 } from "lucide-react";

const db = getFirestore(app);
const storage = getStorage(app);

type Cliente = {
    id: string;
    nombre?: string;
    // Agrega aquí otros campos que tenga un cliente
};

type ReporteCard = {
    clientes: Cliente[];
    pdfUrl?: string;
    pdfName?: string;
};

export default function Reports() {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
    const [reportes, setReportes] = useState<ReporteCard[]>([]);

    // Cargar clientes de Firestore solo cuando se abre el modal
    useEffect(() => {
        if (!showModal) return;
        setIsLoading(true);
        const fetchClientes = async () => {
            const snapshot = await getDocs(collection(db, "clientes"));
            setClientes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        };
        fetchClientes();
    }, [showModal]);

    // Cargar reportes guardados en Storage solo una vez al montar
    useEffect(() => {
        const fetchReportes = async () => {
            const reportsRef = ref(storage, "reportes");
            const res = await listAll(reportsRef);
            const cards: ReporteCard[] = await Promise.all(
                res.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    if (itemRef.name.endsWith(".json")) {
                        const resp = await fetch(url);
                        const data = await resp.json();
                        return { clientes: data };
                    } else if (itemRef.name.endsWith(".pdf")) {
                        // Buscar el JSON asociado (opcional, si quieres mostrar info)
                        return { clientes: [], pdfUrl: url, pdfName: itemRef.name };
                    }
                    return { clientes: [] };
                })
            );
            // Mostrar primero los PDF, luego los JSON
            setReportes([
                ...cards.filter(c => c.pdfUrl),
                ...cards.filter(c => !c.pdfUrl)
            ]);
        };
        fetchReportes();
    }, []); // <-- Siempre un array constante

    const handleCardClick = () => setShowModal(true);

    const handleCheckboxChange = (id: string) => {
        setSelectedClientes(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    // Generar y descargar PDF, subirlo a Storage y actualizar cards
    const handleGenerateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        const selected = clientes.filter(c => selectedClientes.includes(c.id));
        if (selected.length === 0) return;

        setIsLoading(true);

        // 1. Generar PDF
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Reporte de Clientes", 14, 18);
        doc.setFontSize(12);

        let y = 30;
        selected.forEach((cliente, idx) => {
            doc.text(`Cliente ${idx + 1}:`, 14, y);
            y += 8;
            Object.entries(cliente).forEach(([key, value]) => {
                if (key !== "id") {
                    doc.text(`${key}: ${value}`, 20, y);
                    y += 7;
                }
            });
            y += 5;
            if (y > 270 && idx < selected.length - 1) {
                doc.addPage();
                y = 20;
            }
        });

        // 2. Descargar PDF localmente
        doc.save("reporte_clientes.pdf");

        // 3. Subir PDF a Firebase Storage
        const pdfBlob = doc.output("blob");
        const pdfName = `reporte_${Date.now()}.pdf`;
        const pdfRef = ref(storage, `reportes/${pdfName}`);
        await uploadString(pdfRef, await pdfBlob.text(), "raw", { contentType: "application/pdf" });

        // 4. Subir también el JSON (opcional, para mantener compatibilidad)
        const reporteData = JSON.stringify(selected);
        const reporteRef = ref(storage, `reportes/reporte_${Date.now()}.json`);
        await uploadString(reporteRef, reporteData, "raw", { contentType: "application/json" });

        // 5. Obtener URL del PDF y actualizar cards
        const pdfUrl = await getDownloadURL(pdfRef);
        setReportes(prev => [{ clientes: selected, pdfUrl, pdfName }, ...prev]);
        setIsLoading(false);
        setShowModal(false);
        setSelectedClientes([]);
    };

    // Eliminar reporte PDF y JSON de Firebase Storage
    const handleDeleteReport = async (pdfName?: string) => {
        if (!pdfName) return;
        setIsLoading(true);
        try {
            // Eliminar PDF
            const pdfRef = ref(storage, `reportes/${pdfName}`);
            await deleteObject(pdfRef);

            // Eliminar JSON asociado (si existe)
            const jsonName = pdfName.replace(/\.pdf$/, ".json");
            const jsonRef = ref(storage, `reportes/${jsonName}`);
            try {
                await deleteObject(jsonRef);
            } catch { /* Puede no existir, ignorar error */ }

            // Actualizar lista de reportes
            setReportes(prev => prev.filter(r => r.pdfName !== pdfName));
        } catch{
            // Puedes mostrar un toast/error aquí si lo deseas
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 space-x-2 space-y-2 justify-items-center">
                    {/* Card de agregar */}
                    <div
                        onClick={handleCardClick}
                        className="w-56 h-64 border-2 border-dashed border-yellow-400 bg-white flex items-center justify-center text-yellow-500 text-8xl cursor-pointer rounded-3xl shadow-lg hover:shadow-2xl hover:border-solid hover:border-yellow-500 transition-all duration-200"
                        style={{ minWidth: "14rem" }}
                    >
                        <span className="font-extrabold text-8xl select-none">+</span>
                    </div>

                    {/* Mostrar reportes guardados */}
                    {reportes.map((reporte, idx) => (
                        <div
                            key={idx}
                            className="w-56 h-64 flex flex-col justify-between rounded-3xl bg-white shadow-xl hover:shadow-2xl border border-yellow-100 p-6 relative transition-all duration-200 group"
                            style={{ minWidth: "14rem" }}
                        >
                            <button
                                type="button"
                                title="Eliminar reporte"
                                onClick={() => handleDeleteReport(reporte.pdfName)}
                                className="absolute top-3 right-3 bg-yellow-100 hover:bg-yellow-200 rounded-full p-1 transition z-10"
                                disabled={isLoading}
                            >
                                <Trash2 className="w-5 h-5 text-yellow-500" />
                            </button>
                            <div className="flex flex-col gap-2 h-full">
                                <h4 className="text-yellow-600 font-extrabold text-lg tracking-wide mb-1 flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
                                    Reporte {idx + 1}
                                </h4>
                                <div className="mt-1 space-y-1 max-h-28 overflow-y-auto custom-scrollbar pr-1">
                                    {Array.isArray(reporte.clientes) && reporte.clientes.length > 0
                                        ? reporte.clientes.map((cliente, i) => (
                                            <div
                                                key={i}
                                                className="bg-yellow-50 rounded-md px-2 py-1 text-xs text-gray-800 shadow-sm border border-yellow-100 flex flex-col"
                                            >
                                                <strong className="text-yellow-600 truncate">{cliente.nombre || cliente.id}</strong>
                                            </div>
                                        ))
                                        : (
                                            <div className="text-gray-400 text-xs italic">Sin datos de clientes</div>
                                        )}
                                </div>
                                <div className="flex flex-col gap-2 mt-auto">
                                    {reporte.pdfUrl && (
                                        <>
                                            <a
                                                href={reporte.pdfUrl}
                                                download={reporte.pdfName}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-bold text-xs hover:bg-yellow-600 transition-all shadow text-center w-full"
                                            >
                                                Descargar PDF
                                            </a>
                                            <a
                                                href={reporte.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-white border border-yellow-400 text-yellow-600 rounded-xl font-bold text-xs hover:bg-yellow-50 transition-all shadow text-center w-full"
                                            >
                                                Abrir PDF
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white px-10 py-10 rounded-3xl min-w-[370px] shadow-2xl border border-gray-100">
                        <h3 className="mb-7 text-yellow-600 font-extrabold text-2xl tracking-wide text-center">
                            Selecciona clientes
                        </h3>
                        <form onSubmit={handleGenerateReport}>
                            <div className="max-h-60 overflow-y-auto mb-7 pr-1 min-h-[80px] flex flex-col justify-center">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-24">
                                        <LoaderCircle className="animate-spin w-10 h-10 text-yellow-500" />
                                    </div>
                                ) : (
                                    clientes.map(cliente => (
                                        <div key={cliente.id} className="mb-3 flex items-center">
                                            <label className="flex items-center gap-3 text-base text-gray-700 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClientes.includes(cliente.id)}
                                                    onChange={() => handleCheckboxChange(cliente.id)}
                                                    className="accent-yellow-500 w-5 h-5 rounded focus:ring-2 focus:ring-yellow-400"
                                                />
                                                <span className="font-medium">{cliente.nombre || cliente.id}</span>
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="flex gap-4 justify-end">
                                <button
                                    type="submit"
                                    className="bg-yellow-500 text-white rounded-lg px-7 py-2 font-bold text-base shadow hover:bg-yellow-600 transition-all flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <LoaderCircle className="animate-spin w-5 h-5" /> Generando...
                                        </span>
                                    ) : (
                                        "Generar reporte"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-100 text-yellow-500 border border-gray-200 rounded-lg px-7 py-2 font-bold text-base hover:bg-gray-200 transition-all"
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}