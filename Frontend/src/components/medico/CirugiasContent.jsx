import { useState, useEffect } from "react";
import { Plus, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";

export function CirugiasContent() {
  const { user } = useAuth();
  const [cirugias, setCirugias] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCirugia, setSelectedCirugia] = useState(null);
  const [quirofanos, setQuirofanos] = useState([]);
  const [formData, setFormData] = useState({
    id_paciente: "",
    id_quirofano: "",
    fecha_programada: "",
    hora: "",
    tipo_cirugia: "",
    descripcion: "",
  });

  useEffect(() => {
    loadCirugias();
    loadQuirofanos();
  }, []);

  const loadCirugias = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/cirugias`
      );
      const data = response.data?.data || response.data || [];
      setCirugias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando cirugías:", error);
      toast.error("Error al cargar cirugías");
      setCirugias([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadQuirofanos = async () => {
    try {
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/quirofanos`
      );
      const data = response.data?.data || response.data || [];
      setQuirofanos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando quirófanos:", error);
      setQuirofanos([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id_paciente ||
      !formData.id_quirofano ||
      !formData.fecha_programada ||
      !formData.tipo_cirugia
    ) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      await apiClient.post(`/medicos/${user?.id_medico}/cirugias`, {
        id_paciente: parseInt(formData.id_paciente),
        id_quirofano: parseInt(formData.id_quirofano),
        fecha_programada: formData.fecha_programada,
        hora: formData.hora,
        tipo_cirugia: formData.tipo_cirugia,
        descripcion: formData.descripcion,
      });

      toast.success("Cirugía programada");
      setShowModal(false);
      setFormData({
        id_paciente: "",
        id_quirofano: "",
        fecha_programada: "",
        hora: "",
        tipo_cirugia: "",
        descripcion: "",
      });
      loadCirugias();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleDeleteCirugia = async (id_cirugia) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cirugía?")) {
      return;
    }

    try {
      await apiClient.delete(
        `/medicos/${user?.id_medico}/cirugias/${id_cirugia}`
      );

      toast.success("Cirugía cancelada");
      loadCirugias();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Cargando cirugías...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Programar Cirugías
          </h2>
          <p className="text-gray-600">Programa cirugías para tus pacientes</p>
        </div>
        <button
          onClick={() => {
            setSelectedCirugia(null);
            setFormData({
              id_paciente: "",
              id_quirofano: "",
              fecha_programada: "",
              hora: "",
              tipo_cirugia: "",
              descripcion: "",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Programar cirugía
        </button>
      </div>

      {cirugias.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">
            Aún no tienes cirugías programadas
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Programar cirugía
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {cirugias.map((cirugia) => (
            <div
              key={cirugia.id_cirugia}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cirugia.nombre_paciente} {cirugia.apellido_paciente}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {cirugia.tipo_cirugia}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    cirugia.estado === "Realizada"
                      ? "bg-green-100 text-green-800"
                      : cirugia.estado === "En progreso"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {cirugia.estado}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                <div>
                  <p className="text-xs text-gray-500 font-medium">FECHA</p>
                  <p className="font-medium text-gray-900">
                    {cirugia.fecha_programada}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">HORA</p>
                  <p className="font-medium text-gray-900">{cirugia.hora}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">QUIRÓFANO</p>
                  <p className="font-medium text-gray-900">
                    {cirugia.quirofano}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCirugia(cirugia)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </button>
                <button
                  onClick={() => handleDeleteCirugia(cirugia.id_cirugia)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Programar Cirugía */}
      {showModal && !selectedCirugia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                Programar Cirugía
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
                  Tipo de cirugía *
                </label>
                <input
                  type="text"
                  name="tipo_cirugia"
                  value={formData.tipo_cirugia}
                  onChange={handleInputChange}
                  placeholder="Ej: Apendicectomía"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Quirófano *
                </label>
                <select
                  name="id_quirofano"
                  value={formData.id_quirofano}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un quirófano</option>
                  {quirofanos.map((qf) => (
                    <option key={qf.id_quirofano} value={qf.id_quirofano}>
                      {qf.nombre} - {qf.ubicacion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Fecha programada *
                </label>
                <input
                  type="date"
                  name="fecha_programada"
                  value={formData.fecha_programada}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción de la cirugía"
                  rows="3"
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
                  Programar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Cirugía */}
      {selectedCirugia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedCirugia(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                Cirugía - {selectedCirugia.nombre_paciente}{" "}
                {selectedCirugia.apellido_paciente}
              </h3>
              <button
                onClick={() => setSelectedCirugia(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo de cirugía</p>
                  <p className="font-semibold">
                    {selectedCirugia.tipo_cirugia}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-semibold">{selectedCirugia.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold">
                    {selectedCirugia.fecha_programada}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hora</p>
                  <p className="font-semibold">{selectedCirugia.hora}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quirófano</p>
                  <p className="font-semibold">{selectedCirugia.quirofano}</p>
                </div>
              </div>

              {selectedCirugia.descripcion && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Descripción</h4>
                  <p className="text-gray-700 bg-gray-50 rounded p-4">
                    {selectedCirugia.descripcion}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedCirugia(null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
