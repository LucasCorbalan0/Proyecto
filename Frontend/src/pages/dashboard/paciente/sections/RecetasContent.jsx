import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import { Pill, Calendar, Package, Download } from "lucide-react";
import apiClient from "../../../../services/apiClient";

export function RecetasContent() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        setLoading(true);
        const idPaciente = localStorage.getItem("id_paciente");
        if (!idPaciente) {
          throw new Error("No se encontró el ID del paciente");
        }

        const response = await apiClient.get(
          `/pacientes/recetas/${idPaciente}`
        );
        setRecetas(response.data.data || []);
      } catch (err) {
        console.error("Error al cargar recetas:", err);
        toast.error("Error al cargar las recetas médicas");
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);

  const handleDescargarReceta = (receta) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Receta Médica", 20, 20);
    doc.setFontSize(12);
    doc.text(`Medicamento: ${receta.medicamento}`, 20, 35);
    doc.text(
      `Médico: Dr. ${receta.nombre_medico} ${receta.apellido_medico}`,
      20,
      45
    );
    doc.text(`Dosis: ${receta.dosis}`, 20, 55);
    doc.text(
      `Fecha Emisión: ${new Date(receta.fecha_emision).toLocaleDateString()}`,
      20,
      65
    );
    doc.save(`Receta_${receta.medicamento.replace(/\s/g, "_")}.pdf`);
    toast.success("PDF de la receta descargado");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Recetas</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : recetas.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">No tienes recetas emitidas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recetas.map((receta, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {receta.medicamento}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Recetado por Dr. {receta.nombre_medico}{" "}
                    {receta.apellido_medico}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Activa
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <Pill className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Dosis</p>
                    <p className="text-gray-900">{receta.dosis}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Cantidad de dosis</p>
                    <p className="text-gray-900">
                      {receta.cantidad || "No especificada"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Emisión</p>
                    <p className="text-gray-900">
                      {new Date(receta.fecha_emision).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDescargarReceta(receta)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
