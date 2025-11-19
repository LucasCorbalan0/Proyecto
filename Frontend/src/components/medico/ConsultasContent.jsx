import { useState, useEffect } from "react";
import { Plus, Eye, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";
import { HistorialClinicoModal } from "./HistorialClinicoModal";

export function ConsultasContent() {
  const { user } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedPacienteHistorial, setSelectedPacienteHistorial] =
    useState(null);
  const [formData, setFormData] = useState({
    id_paciente: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
  });

  useEffect(() => {
    loadConsultas();
  }, []);

  const loadConsultas = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/consultas`
      );
      const data = response.data?.data || response.data || [];
      setConsultas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando consultas:", error);
      toast.error("Error al cargar consultas");
      setConsultas([]);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_paciente || !formData.observaciones) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      await apiClient.post(`/medicos/${user?.id_medico}/consultas`, {
        id_paciente: parseInt(formData.id_paciente),
        diagnostico: formData.diagnostico,
        tratamiento: formData.tratamiento,
        motivo_consulta: formData.observaciones,
      });

      toast.success("Consulta registrada");
      setShowModal(false);
      setFormData({
        id_paciente: "",
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
      });
      loadConsultas();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleAgregarEvolucion = async (id_consulta) => {
    // Aquí iría la lógica para agregar evolución
    toast.info("Función de evoluciones próximamente");
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Cargando consultas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Mis Consultas
          </h2>
          <p className="text-gray-600">Registra diagnósticos y tratamientos</p>
        </div>
        <button
          onClick={() => {
            setSelectedConsulta(null);
            setFormData({
              id_paciente: "",
              diagnostico: "",
              tratamiento: "",
              observaciones: "",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva consulta
        </button>
      </div>

      {consultas.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">
            Aún no tienes consultas registradas
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Registrar consulta
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {consultas.map((cons) => (
            <div
              key={cons.id_consulta}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cons.nombre_paciente} {cons.apellido_paciente}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Fecha: {new Date(cons.fecha).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {cons.total_evoluciones > 0
                    ? `${cons.total_evoluciones} evoluciones`
                    : "Sin evoluciones"}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    DIAGNÓSTICO
                  </p>
                  <p className="text-gray-900">{cons.diagnostico}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    TRATAMIENTO
                  </p>
                  <p className="text-gray-900">{cons.tratamiento}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAgregarEvolucion(cons.id_consulta)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Agregar evolución
                </button>
                <button
                  onClick={() => {
                    setSelectedPacienteHistorial({
                      id_paciente: cons.id_paciente,
                      nombre: cons.nombre_paciente,
                      apellido: cons.apellido_paciente,
                    });
                    setShowHistorialModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                  title="Ver historial clínico completo"
                >
                  <Eye className="w-4 h-4" />
                  Historial
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Consulta */}
      {showModal && !selectedConsulta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                Nueva Consulta
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Paciente *
                </label>
                <input
                  type="number"
                  name="id_paciente"
                  value={formData.id_paciente}
                  onChange={handleInputChange}
                  placeholder="ID del paciente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Diagnóstico *
                </label>
                <textarea
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleInputChange}
                  placeholder="Describe el diagnóstico"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tratamiento *
                </label>
                <textarea
                  name="tratamiento"
                  value={formData.tratamiento}
                  onChange={handleInputChange}
                  placeholder="Describe el tratamiento"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  placeholder="Observaciones adicionales"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Consulta */}
      {selectedConsulta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedConsulta(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                Consulta - {selectedConsulta.nombre_paciente}{" "}
                {selectedConsulta.apellido_paciente}
              </h3>
              <button
                onClick={() => setSelectedConsulta(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold">
                    {new Date(selectedConsulta.fecha).toLocaleDateString(
                      "es-ES"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">DNI</p>
                  <p className="font-semibold">{selectedConsulta.dni}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Motivo</h4>
                <p className="text-gray-700 bg-gray-50 rounded p-4">
                  {selectedConsulta.motivo}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Diagnóstico</h4>
                <p className="text-gray-700 bg-gray-50 rounded p-4">
                  {selectedConsulta.diagnostico}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Tratamiento</h4>
                <p className="text-gray-700 bg-gray-50 rounded p-4">
                  {selectedConsulta.tratamiento}
                </p>
              </div>

              <button
                onClick={() => setSelectedConsulta(null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial Clínico */}
      {showHistorialModal && selectedPacienteHistorial && (
        <HistorialClinicoModal
          id_paciente={selectedPacienteHistorial.id_paciente}
          pacienteNombre={`${selectedPacienteHistorial.nombre} ${selectedPacienteHistorial.apellido}`}
          onClose={() => {
            setShowHistorialModal(false);
            setSelectedPacienteHistorial(null);
          }}
        />
      )}
    </div>
  );
}
