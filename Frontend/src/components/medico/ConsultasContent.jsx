import { useState, useEffect } from "react";
import { Plus, Eye, Loader, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";
import { HistorialClinicoModal } from "./HistorialClinicoModal";

export function ConsultasContent() {
  const { user } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [filteredConsultas, setFilteredConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedPacienteHistorial, setSelectedPacienteHistorial] =
    useState(null);
  const [searchPaciente, setSearchPaciente] = useState("");
  const [showPacienteDropdown, setShowPacienteDropdown] = useState(false);
  const [searchConsultas, setSearchConsultas] = useState("");
  const [pacienteHistoria, setPacienteHistoria] = useState(null);
  const [loadingHistoria, setLoadingHistoria] = useState(false);
  const [formData, setFormData] = useState({
    id_paciente: "",
    paciente_nombre: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
  });

  useEffect(() => {
    loadConsultas();
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      const response = await apiClient.get("/pacientes");
      const data = response.data?.data || response.data || [];
      console.log("Pacientes cargados:", data);
      setPacientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
    }
  };

  const loadConsultas = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/consultas`
      );
      const data = response.data?.data || response.data || [];
      setConsultas(Array.isArray(data) ? data : []);
      setFilteredConsultas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando consultas:", error);
      toast.error("Error al cargar consultas");
      setConsultas([]);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSearchConsultas = (value) => {
    setSearchConsultas(value);

    if (!value.trim()) {
      setFilteredConsultas(consultas);
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = consultas.filter((c) => {
      const nombrePaciente = `${c.nombre_paciente || ""} ${
        c.apellido_paciente || ""
      }`.toLowerCase();
      const dni = c.dni?.toLowerCase() || "";
      const diagnostico = (c.diagnostico || "").toLowerCase();

      return (
        nombrePaciente.includes(searchLower) ||
        dni.includes(searchLower) ||
        diagnostico.includes(searchLower)
      );
    });

    setFilteredConsultas(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      console.log("Buscando:", searchLower, "en:", fullName, dni);
      return fullName.includes(searchLower) || dni.includes(searchLower);
    });

    console.log("Resultados filtrados:", filtered);
    setFilteredPacientes(filtered);
    setShowPacienteDropdown(filtered.length > 0);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_paciente || !formData.observaciones) {
      toast.error("Por favor selecciona un paciente y completa el motivo");
      return;
    }

    try {
      await apiClient.post(`/medicos/${user?.id_medico}/consultas`, {
        id_paciente: parseInt(formData.id_paciente),
        diagnostico: formData.diagnostico,
        tratamiento: formData.tratamiento,
        motivo_consulta: formData.observaciones,
      });

      toast.success("Consulta registrada exitosamente");
      setShowModal(false);
      setSearchPaciente("");
      setFormData({
        id_paciente: "",
        paciente_nombre: "",
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
      });
      loadConsultas();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Error al registrar consulta"
      );
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
        <>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchConsultas}
              onChange={(e) => handleSearchConsultas(e.target.value)}
              placeholder="Buscar consultas por nombre, DNI o diagnóstico..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filteredConsultas.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No se encontraron consultas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConsultas.map((cons) => (
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
                        Fecha:{" "}
                        {new Date(cons.fecha).toLocaleDateString("es-ES")}
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
        </>
      )}

      {/* Modal Nueva Consulta */}
      {showModal && !selectedConsulta && (
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
                <h3 className="text-xl font-bold">Nueva Consulta</h3>
                <p className="text-blue-100 text-sm">
                  Registra un diagnóstico y tratamiento
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
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700">
                      Sin información clínica registrada
                    </p>
                  )}
                </div>
              )}

              {/* Motivo de Consulta */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Motivo de la Consulta *
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  placeholder="¿Por qué acude el paciente?"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Diagnóstico */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Diagnóstico
                </label>
                <textarea
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleInputChange}
                  placeholder="Describe el diagnóstico"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Tratamiento */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tratamiento
                </label>
                <textarea
                  name="tratamiento"
                  value={formData.tratamiento}
                  onChange={handleInputChange}
                  placeholder="Describe el tratamiento recomendado"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
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
                      diagnostico: "",
                      tratamiento: "",
                      observaciones: "",
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
                  Registrar Consulta
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
