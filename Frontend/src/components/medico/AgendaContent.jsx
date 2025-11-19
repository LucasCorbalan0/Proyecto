import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";
import { HistorialClinicoModal } from "./HistorialClinicoModal";

export function AgendaContent() {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedPacienteHistorial, setSelectedPacienteHistorial] =
    useState(null);

  useEffect(() => {
    loadTurnos();
  }, []);

  const loadTurnos = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/turnos`
      );
      setTurnos(response.data?.data || []);
    } catch (error) {
      console.error("Error cargando turnos:", error);
      toast.error("Error al cargar los turnos");
    } finally {
      setDataLoading(false);
    }
  };

  const handleMarcarAtendido = async (id_turno) => {
    try {
      const response = await apiClient.put(
        `/medicos/${user?.id_medico}/turnos/${id_turno}/atender`
      );
      if (response) {
        toast.success("Turno marcado como atendido");
        loadTurnos();
      }
    } catch (error) {
      console.error("Error marcando turno:", error);
      toast.error("Error al actualizar el turno");
    }
  };

  const loadPatientHistory = async (id_paciente) => {
    try {
      const response = await apiClient.get(
        `/medicos/${user?.id_medico}/pacientes/${id_paciente}/historia`
      );
      setSelectedPatient(response.data);
      setShowPatientModal(true);
    } catch (error) {
      console.error("Error cargando historia:", error);
      toast.error("Error al cargar la historia clínica");
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Cargando turnos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Agenda de Turnos
        </h2>
        <p className="text-gray-600">Turnos en espera para atender hoy</p>
      </div>

      {turnos.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No hay turnos en espera</p>
        </div>
      ) : (
        <div className="space-y-3">
          {turnos.map((turno) => (
            <div
              key={turno.id_turno}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {turno.nombre_paciente} {turno.apellido_paciente}
                    </h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      {turno.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Hora:{" "}
                    <span className="font-medium">{turno.hora_inicio}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    DNI: <span className="font-medium">{turno.dni}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPacienteHistorial({
                      id_paciente: turno.id_paciente,
                      nombre: turno.nombre_paciente,
                      apellido: turno.apellido_paciente,
                    });
                    setShowHistorialModal(true);
                  }}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors mr-2"
                  title="Ver historial clínico completo"
                >
                  <Eye className="w-5 h-5 text-blue-600" />
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleMarcarAtendido(turno.id_turno)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Marcar como atendido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient History Modal - DEPRECATED - Use HistorialClinicoModal instead */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowPatientModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Historia Clínica - {selectedPatient.nombre}
              </h3>
              <button
                onClick={() => setShowPatientModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">DNI</p>
                  <p className="font-semibold">{selectedPatient.dni}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Edad</p>
                  <p className="font-semibold">{selectedPatient.edad} años</p>
                </div>
              </div>

              {selectedPatient.consultas &&
                selectedPatient.consultas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Consultas Previas
                    </h4>
                    <div className="space-y-2">
                      {selectedPatient.consultas.map((cons, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded p-3 border border-gray-200"
                        >
                          <p className="text-sm text-gray-600">{cons.fecha}</p>
                          <p className="font-medium text-gray-900">
                            {cons.diagnostico}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial Clínico Completo */}
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
