import { useState, useEffect } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";

export function RecetasContent() {
  const { user } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    id_paciente: "",
    observaciones: "",
    items: [],
  });
  const [currentItem, setCurrentItem] = useState({
    id_producto: "",
    cantidad: 1,
    indicaciones: "",
  });

  useEffect(() => {
    loadRecetas();
    loadProductos();
  }, []);

  const loadRecetas = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/recetas`
      );
      const data = response.data?.data || response.data || [];
      setRecetas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando recetas:", error);
      toast.error("Error al cargar recetas");
      setRecetas([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadProductos = async () => {
    try {
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/medicamentos`
      );
      const data = response.data?.data || response.data || [];
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando medicamentos:", error);
      setProductos([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (!currentItem.id_producto) {
      toast.error("Selecciona un producto");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...currentItem }],
    }));

    setCurrentItem({
      id_producto: "",
      cantidad: 1,
      indicaciones: "",
    });
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_paciente || formData.items.length === 0) {
      toast.error("Completa los campos obligatorios y agrega medicamentos");
      return;
    }

    try {
      const medicamentos = formData.items.map((item) => ({
        id_medicamento: parseInt(item.id_producto),
        dosis: item.indicaciones,
        duracion_dias: 30,
      }));

      await apiClient.post(`/medicos/${user?.id_medico}/recetas`, {
        id_paciente: parseInt(formData.id_paciente),
        medicamentos: medicamentos,
        validez_dias: 30,
      });

      toast.success("Receta generada");
      setShowModal(false);
      setFormData({
        id_paciente: "",
        observaciones: "",
        items: [],
      });
      loadRecetas();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleDeleteReceta = async (id_receta) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
      return;
    }

    try {
      await apiClient.delete(
        `/medicos/${user?.id_medico}/recetas/${id_receta}`
      );

      toast.success("Receta eliminada");
      loadRecetas();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Cargando recetas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Recetas Electrónicas
          </h2>
          <p className="text-gray-600">Genera recetas para tus pacientes</p>
        </div>
        <button
          onClick={() => {
            setSelectedReceta(null);
            setFormData({
              id_paciente: "",
              observaciones: "",
              items: [],
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva receta
        </button>
      </div>

      {recetas.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">Aún no tienes recetas generadas</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear receta
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recetas.map((receta) => (
            <div
              key={receta.id_receta}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {receta.nombre_paciente} {receta.apellido_paciente}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Fecha:{" "}
                    {new Date(receta.fecha_emision).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  {receta.total_medicamentos} medicamentos
                </span>
              </div>

              {receta.medicamentos && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600 font-medium mb-2">
                    MEDICAMENTOS
                  </p>
                  <ul className="text-sm text-gray-900 space-y-1">
                    {receta.medicamentos.map((med, idx) => (
                      <li key={idx}>
                        {med.nombre} - {med.cantidad} {med.unidad}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReceta(receta)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                <button
                  onClick={() => handleDeleteReceta(receta.id_receta)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Receta */}
      {showModal && !selectedReceta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Nueva Receta</h3>
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

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Medicamentos
                </h4>

                <div className="space-y-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Medicamento *
                    </label>
                    <select
                      name="id_producto"
                      value={currentItem.id_producto}
                      onChange={handleItemChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona un medicamento</option>
                      {productos.map((prod) => (
                        <option key={prod.id_producto} value={prod.id_producto}>
                          {prod.nombre} - {prod.presentacion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      name="cantidad"
                      value={currentItem.cantidad}
                      onChange={handleItemChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Indicaciones
                    </label>
                    <textarea
                      name="indicaciones"
                      value={currentItem.indicaciones}
                      onChange={handleItemChange}
                      placeholder="Ej: 1 comprimido cada 8 horas"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                  >
                    + Agregar medicamento
                  </button>
                </div>

                {formData.items.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      Medicamentos agregados:
                    </p>
                    {formData.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                      >
                        <div className="text-sm text-gray-900">
                          <p className="font-medium">
                            Producto ID: {item.id_producto}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.cantidad} unidad(es) - {item.indicaciones}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  Generar receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Receta */}
      {selectedReceta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedReceta(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                Receta - {selectedReceta.nombre_paciente}{" "}
                {selectedReceta.apellido_paciente}
              </h3>
              <button
                onClick={() => setSelectedReceta(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold">{selectedReceta.fecha}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-semibold">Vigente</p>
                </div>
              </div>

              {selectedReceta.medicamentos && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Medicamentos</h4>
                  <div className="space-y-2">
                    {selectedReceta.medicamentos.map((med, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded p-3 bg-gray-50"
                      >
                        <p className="font-medium text-gray-900">
                          {med.nombre}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cantidad: {med.cantidad} {med.unidad}
                        </p>
                        <p className="text-sm text-gray-600">
                          Indicaciones: {med.indicaciones}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedReceta.observaciones && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Observaciones
                  </h4>
                  <p className="text-gray-700 bg-gray-50 rounded p-4">
                    {selectedReceta.observaciones}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedReceta(null)}
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
