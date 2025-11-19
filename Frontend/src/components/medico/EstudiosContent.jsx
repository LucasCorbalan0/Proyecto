import { useState, useEffect } from "react";
import { Plus, Eye, Trash2, Search, X, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";

export function EstudiosContent() {
  const { user } = useAuth();
  const [estudios, setEstudios] = useState([]);
  const [filteredEstudios, setFilteredEstudios] = useState([]);
  const [searchEstudios, setSearchEstudios] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEstudio, setSelectedEstudio] = useState(null);
  const [searchPaciente, setSearchPaciente] = useState("");
  const [showPacienteDropdown, setShowPacienteDropdown] = useState(false);
  const [pacienteHistoria, setPacienteHistoria] = useState(null);
  const [loadingHistoria, setLoadingHistoria] = useState(false);
  const [formData, setFormData] = useState({
    id_paciente: "",
    paciente_nombre: "",
    tipo: "Laboratorio",
    descripcion: "",
    urgencia: "Normal",
  });

  const tiposEstudios = [
    "Laboratorio",
    "Radiografía",
    "Ecografía",
    "Tomografía",
    "RMN",
    "EKG",
    "Endoscopia",
    "Otro",
  ];

  useEffect(() => {
    loadEstudios();
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

  const handleSearchEstudios = (value) => {
    setSearchEstudios(value);
    if (!value.trim()) {
      setFilteredEstudios(estudios);
      return;
    }
    const filtered = estudios.filter((estudio) => {
      const nombrePaciente =
        `${estudio.nombre_paciente} ${estudio.apellido_paciente}`.toLowerCase();
      const dni = estudio.dni?.toLowerCase() || "";
      const searchLower = value.toLowerCase();
      return nombrePaciente.includes(searchLower) || dni.includes(searchLower);
    });
    setFilteredEstudios(filtered);
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

  const loadEstudios = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/estudios`
      );
      const data = response.data?.data || response.data || [];
      const estudiosArray = Array.isArray(data) ? data : [];
      setEstudios(estudiosArray);
      setFilteredEstudios(estudiosArray);
    } catch (error) {
      console.error("Error cargando estudios:", error);
      toast.error("Error al cargar estudios");
      setEstudios([]);
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

    if (!formData.id_paciente || !formData.tipo) {
      toast.error("Selecciona un paciente y tipo de estudio");
      return;
    }

    try {
      await apiClient.post(`/medicos/${user?.id_medico}/estudios`, {
        id_paciente: parseInt(formData.id_paciente),
        tipo_estudio: formData.tipo,
        descripcion: formData.descripcion,
        urgencia: formData.urgencia,
      });

      toast.success("Estudio solicitado exitosamente");
      setShowModal(false);
      setSearchPaciente("");
      setPacienteHistoria(null);
      setFormData({
        id_paciente: "",
        paciente_nombre: "",
        tipo: "Laboratorio",
        descripcion: "",
        urgencia: "Normal",
      });
      loadEstudios();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Error al solicitar estudio"
      );
    }
  };

  const handleDeleteEstudio = async (id_estudio) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar este estudio?")) {
      return;
    }

    try {
      await apiClient.delete(
        `/medicos/${user?.id_medico}/estudios/${id_estudio}`
      );

      toast.success("Estudio cancelado");
      loadEstudios();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Cargando estudios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Solicitar Estudios
          </h2>
          <p className="text-gray-600">
            Solicita estudios médicos a tus pacientes
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedEstudio(null);
            setFormData({
              id_paciente: "",
              tipo: "Laboratorio",
              descripcion: "",
              urgencia: "Normal",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Solicitar estudio
        </button>
      </div>

      {estudios.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">
            Aún no tienes estudios solicitados
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear solicitud
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchEstudios}
              onChange={(e) => handleSearchEstudios(e.target.value)}
              placeholder="Buscar estudios por nombre de paciente o DNI..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-3">
            {filteredEstudios.length === 0 ? (
              <p className="text-center py-8 text-gray-600">
                {searchEstudios
                  ? "No se encontraron estudios"
                  : "No hay estudios creados"}
              </p>
            ) : (
              filteredEstudios.map((estudio) => (
                <div
                  key={estudio.id_estudio}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {estudio.nombre_paciente} {estudio.apellido_paciente}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Tipo: {estudio.tipo_estudio}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          estudio.estado === "Pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : estudio.estado === "Realizado"
                            ? "bg-blue-100 text-blue-800"
                            : estudio.estado === "Resultado Disponible"
                            ? "bg-green-100 text-green-800"
                            : estudio.estado === "Cancelado"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {estudio.estado}
                      </span>
                      {estudio.urgencia && (
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            estudio.urgencia === "Urgente"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {estudio.urgencia}
                        </span>
                      )}
                    </div>
                  </div>

                  {estudio.descripcion && (
                    <p className="text-sm text-gray-600 mb-3">
                      {estudio.descripcion}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mb-3">
                    Solicitado: {estudio.fecha_solicitud}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedEstudio(estudio)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </button>
                    <button
                      onClick={() => handleDeleteEstudio(estudio.id_estudio)}
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

      {/* Modal Nueva Solicitud */}
      {showModal && !selectedEstudio && (
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
                <h3 className="text-xl font-bold">Solicitar Estudio</h3>
                <p className="text-blue-100 text-sm">
                  Ordena estudios médicos al paciente
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
                      {pacienteHistoria.antecedentes_quirurgicos && (
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">
                            Antecedentes Quirúrgicos:
                          </span>{" "}
                          {pacienteHistoria.antecedentes_quirurgicos}
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

              {/* Tipo de Estudio */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tipo de Estudio *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {tiposEstudios.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Descripción y Observaciones
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Detalla las indicaciones del estudio"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Urgencia */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nivel de Urgencia
                </label>
                <select
                  name="urgencia"
                  value={formData.urgencia}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgente">Urgente</option>
                </select>
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
                      tipo: "Laboratorio",
                      descripcion: "",
                      urgencia: "Normal",
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
                  Solicitar Estudio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Estudio */}
      {selectedEstudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedEstudio(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                Estudio - {selectedEstudio.nombre_paciente}{" "}
                {selectedEstudio.apellido_paciente}
              </h3>
              <button
                onClick={() => setSelectedEstudio(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-semibold">{selectedEstudio.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-semibold">{selectedEstudio.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Urgencia</p>
                  <p className="font-semibold">{selectedEstudio.urgencia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha Solicitud</p>
                  <p className="font-semibold">
                    {selectedEstudio.fecha_solicitud}
                  </p>
                </div>
              </div>

              {selectedEstudio.descripcion && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Descripción</h4>
                  <p className="text-gray-700 bg-gray-50 rounded p-4">
                    {selectedEstudio.descripcion}
                  </p>
                </div>
              )}

              {selectedEstudio.resultado && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Resultado</h4>
                  <p className="text-gray-700 bg-gray-50 rounded p-4">
                    {selectedEstudio.resultado}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedEstudio(null)}
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
