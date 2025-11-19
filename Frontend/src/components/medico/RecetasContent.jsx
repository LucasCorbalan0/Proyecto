import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, Search, X, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";

export function RecetasContent() {
  const { user } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [filteredRecetas, setFilteredRecetas] = useState([]);
  const [searchRecetas, setSearchRecetas] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [searchPaciente, setSearchPaciente] = useState("");
  const [showPacienteDropdown, setShowPacienteDropdown] = useState(false);
  const [pacienteHistoria, setPacienteHistoria] = useState(null);
  const [loadingHistoria, setLoadingHistoria] = useState(false);
  const [formData, setFormData] = useState({
    id_paciente: "",
    paciente_nombre: "",
    observaciones: "",
    items: [],
  });
  const [currentItem, setCurrentItem] = useState({
    id_producto: "",
    cantidad: 1,
    indicaciones: "",
    frecuencia: "",
  });

  useEffect(() => {
    loadRecetas();
    loadProductos();
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      const response = await apiClient.get("/pacientes");
      const data = response.data?.data || response.data || [];
      setPacientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
    }
  };

  const loadRecetas = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/recetas`
      );
      const data = response.data?.data || response.data || [];
      const recetasArray = Array.isArray(data) ? data : [];
      setRecetas(recetasArray);
      setFilteredRecetas(recetasArray);
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

  const handleSearchPaciente = (value) => {
    setSearchPaciente(value);

    if (!value.trim()) {
      setFilteredPacientes([]);
      setShowPacienteDropdown(false);
      return;
    }

    const filtered = pacientes.filter((p) => {
      const apellido = p.apellido || p.apellidos || "";
      const fullName = `${p.nombre} ${apellido}`.toLowerCase();
      const dni = p.dni?.toLowerCase() || "";
      const searchLower = value.toLowerCase();
      return fullName.includes(searchLower) || dni.includes(searchLower);
    });

    setFilteredPacientes(filtered);
    setShowPacienteDropdown(filtered.length > 0);
  };

  const handleSearchRecetas = (value) => {
    setSearchRecetas(value);
    if (!value.trim()) {
      setFilteredRecetas(recetas);
      return;
    }
    const filtered = recetas.filter((receta) => {
      const nombrePaciente =
        `${receta.nombre_paciente} ${receta.apellido_paciente}`.toLowerCase();
      const dni = receta.dni?.toLowerCase() || "";
      const searchLower = value.toLowerCase();
      return nombrePaciente.includes(searchLower) || dni.includes(searchLower);
    });
    setFilteredRecetas(filtered);
  };

  const handleSelectPaciente = (paciente) => {
    const apellido = paciente.apellido || paciente.apellidos || "";
    setFormData((prev) => ({
      ...prev,
      id_paciente: paciente.id_paciente,
      paciente_nombre: `${paciente.nombre} ${apellido}`,
    }));
    setSearchPaciente(`${paciente.nombre} ${apellido}`);
    setShowPacienteDropdown(false);

    // Load historia clínica
    loadPacienteHistoria(paciente.id_paciente);
  };

  const loadPacienteHistoria = async (id_paciente) => {
    try {
      setLoadingHistoria(true);
      const response = await apiClient.get(
        `/medicos/paciente/${id_paciente}/historial-clinico`
      );
      setPacienteHistoria(response.data?.data || response.data);
    } catch (error) {
      console.error("Error cargando historia clínica:", error);
      setPacienteHistoria(null);
    } finally {
      setLoadingHistoria(false);
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
      toast.error("Selecciona un medicamento");
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
      toast.error("Selecciona un paciente y agrega medicamentos");
      return;
    }

    try {
      const medicamentos = formData.items.map((item) => ({
        id_producto: parseInt(item.id_producto),
        cantidad: item.cantidad || 1,
        dosis: item.indicaciones,
        frecuencia: item.frecuencia || "",
      }));

      await apiClient.post(`/medicos/${user?.id_medico}/recetas`, {
        id_paciente: parseInt(formData.id_paciente),
        medicamentos: medicamentos,
        validez_dias: 30,
      });

      toast.success("Receta generada exitosamente");
      setShowModal(false);
      setSearchPaciente("");
      setFormData({
        id_paciente: "",
        paciente_nombre: "",
        observaciones: "",
        items: [],
      });
      setCurrentItem({
        id_producto: "",
        cantidad: 1,
        indicaciones: "",
      });
      loadRecetas();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al generar receta");
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

  const handleVerReceta = async (receta) => {
    try {
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/recetas/${receta.id_receta}`
      );
      const detalles = response.data?.data || [];
      setSelectedReceta({
        ...receta,
        medicamentos: detalles,
      });
    } catch (error) {
      console.error("Error cargando detalles:", error);
      toast.error("Error al cargar detalles de receta");
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
        <div>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchRecetas}
              onChange={(e) => handleSearchRecetas(e.target.value)}
              placeholder="Buscar recetas por nombre de paciente o DNI..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-3">
            {filteredRecetas.length === 0 ? (
              <p className="text-center py-8 text-gray-600">
                {searchRecetas
                  ? "No se encontraron recetas"
                  : "No hay recetas creadas"}
              </p>
            ) : (
              filteredRecetas.map((receta) => (
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
                        {new Date(receta.fecha_emision).toLocaleDateString(
                          "es-ES"
                        )}
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
                      onClick={() => handleVerReceta(receta)}
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
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Nueva Receta */}
      {showModal && !selectedReceta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setShowModal(false);
              setSearchPaciente("");
              setShowPacienteDropdown(false);
            }}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Nueva Receta</h3>
                <p className="text-blue-100 text-sm">
                  Prescribe medicamentos al paciente
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSearchPaciente("");
                  setShowPacienteDropdown(false);
                }}
                className="p-1 hover:bg-blue-600 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Búsqueda de Paciente */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Paciente *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchPaciente}
                    onChange={(e) => handleSearchPaciente(e.target.value)}
                    onFocus={() =>
                      searchPaciente && setShowPacienteDropdown(true)
                    }
                    placeholder="Buscar por nombre o DNI..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Dropdown de Pacientes */}
                {showPacienteDropdown && filteredPacientes.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredPacientes.map((paciente) => (
                      <button
                        key={paciente.id_paciente}
                        type="button"
                        onClick={() => handleSelectPaciente(paciente)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <p className="font-medium text-gray-900">
                          {paciente.nombre}{" "}
                          {paciente.apellido || paciente.apellidos || ""}
                        </p>
                        <p className="text-xs text-gray-600">
                          DNI: {paciente.dni} • ID: {paciente.id_paciente}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {searchPaciente &&
                  showPacienteDropdown &&
                  filteredPacientes.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-3 text-center text-gray-600">
                      No se encontraron pacientes
                    </div>
                  )}
              </div>

              {formData.id_paciente && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">
                      Paciente seleccionado:
                    </span>{" "}
                    {formData.paciente_nombre}
                  </p>
                </div>
              )}

              {/* Historia Clínica Info */}
              {formData.id_paciente && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  {loadingHistoria ? (
                    <div className="flex items-center justify-center gap-2 text-amber-700">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">
                        Cargando historia clínica...
                      </span>
                    </div>
                  ) : pacienteHistoria ? (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-amber-900 text-sm">
                        Información Médica
                      </h4>
                      {pacienteHistoria.tipo_sangre && (
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Tipo de Sangre:</span>{" "}
                          {pacienteHistoria.tipo_sangre}{" "}
                          {pacienteHistoria.factor_rh}
                        </p>
                      )}
                      {pacienteHistoria.alergias_conocidas && (
                        <p className="text-xs text-red-700 font-medium">
                          ⚠️ Alergias: {pacienteHistoria.alergias_conocidas}
                        </p>
                      )}
                      {pacienteHistoria.comorbilidades_cronicas && (
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Comorbilidades:</span>{" "}
                          {pacienteHistoria.comorbilidades_cronicas}
                        </p>
                      )}
                      {pacienteHistoria.medicacion_habitual && (
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">
                            Medicación Habitual:
                          </span>{" "}
                          {pacienteHistoria.medicacion_habitual}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700">
                      Sin información clínica registrada
                    </p>
                  )}
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un medicamento</option>
                      {productos.map((prod) => (
                        <option key={prod.id_producto} value={prod.id_producto}>
                          {prod.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Indicaciones (dosis) *
                    </label>
                    <textarea
                      name="indicaciones"
                      value={currentItem.indicaciones}
                      onChange={handleItemChange}
                      placeholder="Ej: 1 comprimido"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Frecuencia (cómo tomar) *
                    </label>
                    <input
                      type="text"
                      name="frecuencia"
                      value={currentItem.frecuencia}
                      onChange={handleItemChange}
                      placeholder="Ej: cada 8 horas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar medicamento
                  </button>
                </div>

                {formData.items.length > 0 && (
                  <div className="space-y-2 border-t border-gray-200 pt-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {formData.items.length} medicamento
                      {formData.items.length !== 1 ? "s" : ""} agregado
                      {formData.items.length !== 1 ? "s" : ""}
                    </p>
                    {formData.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between bg-white p-3 rounded border border-blue-100 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-sm text-gray-900 flex-1">
                          <p className="font-semibold">
                            {productos.find(
                              (p) =>
                                p.id_producto === parseInt(item.id_producto)
                            )?.nombre || "Medicamento"}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.indicaciones}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors ml-2"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSearchPaciente("");
                    setFormData({
                      id_paciente: "",
                      paciente_nombre: "",
                      observaciones: "",
                      items: [],
                    });
                    setCurrentItem({
                      id_producto: "",
                      cantidad: 1,
                      indicaciones: "",
                      frecuencia: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Generar Receta
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
              <div>
                <p className="text-sm text-gray-600">Fecha de Emisión</p>
                <p className="font-semibold">
                  {new Date(selectedReceta.fecha_emision).toLocaleDateString(
                    "es-ES"
                  )}
                </p>
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
                          {med.medicamento}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cantidad: {med.cantidad}
                        </p>
                        <p className="text-sm text-gray-600">
                          Dosis: {med.dosis}
                        </p>
                        <p className="text-sm text-gray-600">
                          Frecuencia: {med.frecuencia}
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
