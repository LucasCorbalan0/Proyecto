import { useState, useEffect } from "react";
import { Calendar, XCircle, Search } from "lucide-react";
import { api } from "../services/api";

export function BuscarMedicosContent({ onTurnoReservado }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchName, setSearchName] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [filteredMedicos, setFilteredMedicos] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadEspecialidades = async () => {
      try {
        setLoading(true);
        const data = await api.getEspecialidades();
        setEspecialidades(data);
      } catch (err) {
        console.error("Error en loadEspecialidades:", err);
        setError("Error al cargar las especialidades");
      } finally {
        setLoading(false);
      }
    };
    loadEspecialidades();
  }, []);

  useEffect(() => {
    const loadMedicos = async () => {
      if (!especialidades.length) return;

      try {
        setLoading(true);
        const data = await api.getMedicos(selectedSpecialty, "");
        setMedicos(data);
        setError(null);
      } catch (err) {
        console.error("Error en loadMedicos:", err);
        setError("Error al cargar los médicos");
        setMedicos([]);
      } finally {
        setLoading(false);
      }
    };

    loadMedicos();
  }, [selectedSpecialty, especialidades]);

  // Filtrar médicos por nombre cuando cambia el search
  useEffect(() => {
    if (!searchName.trim()) {
      setFilteredMedicos(medicos);
    } else {
      const filtered = medicos.filter((m) =>
        `${m.nombre} ${m.apellidos || ""}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
      setFilteredMedicos(filtered);
    }
  }, [searchName, medicos]);

  const loadHorarios = async (medicoId) => {
    try {
      setLoading(true);
      setError(null);
      const fechaInicio = new Date().toISOString().split("T")[0];
      const fechaFin = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const data = await api.getDisponibilidadMedico(
        medicoId,
        fechaInicio,
        fechaFin
      );

      // Normalizar datos: asegurar que fecha sea YYYY-MM-DD string
      const horariosNormalizados = data.map((slot) => ({
        ...slot,
        fecha:
          typeof slot.fecha === "string"
            ? slot.fecha.split("T")[0]
            : new Date(slot.fecha).toISOString().split("T")[0],
      }));

      setHorariosDisponibles(horariosNormalizados);
      const medicoSeleccionado = medicos.find((m) => m.id === medicoId);
      setSelectedDoctor(medicoSeleccionado);
    } catch (err) {
      console.error("Error al cargar horarios:", err);
      setError("Error al cargar los horarios disponibles");
      setHorariosDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  const reservarTurno = async (medicoId, fecha, horaInicio) => {
    try {
      setLoading(true);
      setError(null);

      const idPaciente = localStorage.getItem("id_paciente");
      if (!idPaciente) {
        throw new Error("No se encontró el ID del paciente");
      }

      const fechaTurnoFormatted = `${fecha} ${horaInicio}`;

      // Llamar al backend para reservar
      const response = await api.reservarTurno(
        idPaciente,
        medicoId,
        fechaTurnoFormatted,
        "Consulta general"
      );

      if (response.success) {
        setSuccessMessage("Turno reservado exitosamente");
        // Remover el turno reservado de la lista
        setHorariosDisponibles(
          horariosDisponibles.filter(
            (slot) => !(slot.fecha === fecha && slot.hora_inicio === horaInicio)
          )
        );
        // Después de 2 segundos, volver a Inicio y recargar datos
        setTimeout(() => {
          setSelectedDoctor(null);
          if (onTurnoReservado) {
            onTurnoReservado();
          }
        }, 2000);
      }
    } catch (err) {
      setError("Error al reservar el turno");
      console.error("Error en reservarTurno:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Buscar Médicos</h1>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="specialty"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Especialidad
          </label>
          <select
            id="specialty"
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">Todas las especialidades</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Buscar por nombre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="search"
              type="text"
              placeholder="Ej: Dr. García, Dra. López..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {filteredMedicos.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No se encontraron médicos con estos criterios
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicos.map((medico) => (
          <div
            key={medico.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <img
                src={medico.imagen || "https://via.placeholder.com/64"}
                alt={medico.nombre}
                className="w-16 h-16 rounded-full object-cover bg-gray-200"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {medico.nombre}
                </h3>
                <p className="text-blue-600 text-sm font-medium">
                  {medico.especialidad}
                </p>
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <p>📊 {medico.total_consultas || 0} consultas</p>
                  {medico.matricula && <p>🏥 Matrícula: {medico.matricula}</p>}
                </div>
              </div>
            </div>
            <button
              onClick={() => loadHorarios(medico.id)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Cargando...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Ver Horarios</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {selectedDoctor && horariosDisponibles.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Reservar Turno</h2>
                  <div className="space-y-1">
                    <p className="text-xl font-semibold">
                      {selectedDoctor.nombre}
                    </p>
                    <p className="text-blue-100">
                      {selectedDoctor.especialidad}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <p className="font-semibold mb-1">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Selecciona una fecha y hora disponible para tu consulta:
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(
                  horariosDisponibles.reduce((acc, slot) => {
                    if (!acc[slot.fecha]) acc[slot.fecha] = [];
                    acc[slot.fecha].push(slot);
                    return acc;
                  }, {})
                ).map(([fecha, slots]) => (
                  <div
                    key={fecha}
                    className="border-l-4 border-blue-600 bg-blue-50 rounded-lg p-5"
                  >
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      {new Date(fecha + "T00:00:00").toLocaleDateString(
                        "es-ES",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </h3>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {slots.map((slot, index) => (
                        <button
                          key={index}
                          disabled={loading}
                          onClick={() => {
                            if (
                              confirm(
                                `¿Deseas reservar el turno para ${slot.hora_inicio.substring(
                                  0,
                                  5
                                )}?`
                              )
                            ) {
                              reservarTurno(
                                selectedDoctor.id,
                                slot.fecha,
                                slot.hora_inicio
                              );
                            }
                          }}
                          className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                            loading
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer shadow-md hover:shadow-lg"
                          }`}
                        >
                          {loading && (
                            <div className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          )}
                          {slot.hora_inicio.substring(0, 5)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDoctor && horariosDisponibles.length === 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Calendar className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sin Disponibilidad
              </h2>
              <p className="text-gray-600 mb-6">
                El Dr/Dra. {selectedDoctor.nombre} no tiene horarios disponibles
                en los próximos 7 días.
              </p>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
