import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";

export function DisponibilidadContent() {
  const { user } = useAuth();
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    hora_inicio: "08:00",
    hora_fin: "12:00",
  });

  const diasSemana = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  useEffect(() => {
    loadDisponibilidades();
  }, []);

  const loadDisponibilidades = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/disponibilidad`
      );
      const data = response.data?.data || response.data || [];
      setDisponibilidades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando disponibilidades:", error);
      toast.error("Error al cargar disponibilidades");
      setDisponibilidades([]);
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

    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(formData.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy && !editingId) {
      toast.error("La fecha no puede ser en el pasado");
      return;
    }

    // Validar que hora_fin sea después de hora_inicio
    if (formData.hora_fin <= formData.hora_inicio) {
      toast.error("La hora de fin debe ser después de la hora de inicio");
      return;
    }

    try {
      const url = editingId
        ? `/medicos/${user?.id_medico}/disponibilidad/${editingId}`
        : `/medicos/${user?.id_medico}/disponibilidad`;

      if (editingId) {
        await apiClient.put(url, formData);
      } else {
        await apiClient.post(url, formData);
      }

      toast.success(
        editingId ? "Disponibilidad actualizada" : "Disponibilidad creada"
      );
      setShowModal(false);
      setEditingId(null);
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        hora_inicio: "08:00",
        hora_fin: "12:00",
      });
      loadDisponibilidades();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar esta disponibilidad?"
      )
    )
      return;

    try {
      await apiClient.delete(
        `/medicos/${user?.id_medico}/disponibilidad/${id}`
      );

      toast.success("Disponibilidad eliminada");
      loadDisponibilidades();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleEdit = (disp) => {
    setFormData({
      fecha: disp.fecha,
      hora_inicio: disp.hora_inicio,
      hora_fin: disp.hora_fin,
    });
    setEditingId(disp.id_disponibilidad);
    setShowModal(true);
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Cargando disponibilidades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Mi Disponibilidad
          </h2>
          <p className="text-gray-600">Define tus horarios de atención</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              fecha: new Date().toISOString().split("T")[0],
              hora_inicio: "08:00",
              hora_fin: "12:00",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar disponibilidad
        </button>
      </div>

      {disponibilidades.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">
            Aún no has definido tu disponibilidad
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Configurar disponibilidad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disponibilidades.map((disp) => (
            <div
              key={disp.id_disponibilidad}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(disp.fecha).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {disp.hora_inicio} - {disp.hora_fin}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  Activo
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(disp)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(disp.id_disponibilidad)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? "Editar disponibilidad" : "Agregar disponibilidad"}
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
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Hora de inicio
                </label>
                <input
                  type="time"
                  name="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Hora de fin
                </label>
                <input
                  type="time"
                  name="hora_fin"
                  value={formData.hora_fin}
                  onChange={handleInputChange}
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
                  {editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
