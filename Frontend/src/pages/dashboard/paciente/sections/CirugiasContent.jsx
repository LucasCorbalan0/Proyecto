import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import apiClient from "../../../../services/apiClient";

export function CirugiasContent() {
  const [cirugias, setCircugias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCirugias = async () => {
      try {
        setLoading(true);
        const idPaciente = localStorage.getItem("id_paciente");
        if (!idPaciente) {
          throw new Error("No se encontró el ID del paciente");
        }

        const response = await apiClient.get(
          `/pacientes/cirugias/${idPaciente}`
        );
        setCircugias(response.data.data || []);
      } catch (err) {
        console.error("Error al cargar cirugías:", err);
        toast.error("Error al cargar las cirugías");
      } finally {
        setLoading(false);
      }
    };

    fetchCirugias();
  }, []);

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "Programada":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Programada
          </span>
        );
      case "Realizada":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Realizada
          </span>
        );
      case "Cancelada":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            {estado}
          </span>
        );
    }
  };

  const esFutura = (fecha) => new Date(fecha) > new Date();
  const futuros = cirugias.filter((c) => esFutura(c.fecha));
  const pasados = cirugias.filter((c) => !esFutura(c.fecha));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Mis Cirugías</h1>
        <p className="text-gray-600">
          Información sobre tus procedimientos quirúrgicos programados y
          realizados
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : cirugias.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">
            No tienes cirugías registradas
          </p>
        </div>
      ) : (
        <>
          {/* Cirugías Futuras */}
          {futuros.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Próximas Cirugías
              </h2>
              <div className="space-y-4">
                {futuros.map((cirugia) => (
                  <div
                    key={cirugia.id_cirugia}
                    className="bg-orange-50 border border-orange-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cirugia.tipo_cirugia}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Especialidad: {cirugia.especialidad}
                        </p>
                      </div>
                      {getEstadoBadge(cirugia.estado)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Fecha
                          </p>
                          <p className="text-gray-900 font-medium">
                            {new Date(cirugia.fecha).toLocaleDateString(
                              "es-ES",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Hora
                          </p>
                          <p className="text-gray-900 font-medium">
                            {cirugia.hora_inicio}
                          </p>
                        </div>
                      </div>

                      {cirugia.duracion_estimada && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600 font-medium">
                              Duración Estimada
                            </p>
                            <p className="text-gray-900 font-medium">
                              {cirugia.duracion_estimada} minutos
                            </p>
                          </div>
                        </div>
                      )}

                      {cirugia.numero_quirofano && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600 font-medium">
                              Quirófano
                            </p>
                            <p className="text-gray-900 font-medium">
                              {cirugia.numero_quirofano}
                              {cirugia.piso && ` (Piso ${cirugia.piso})`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-orange-200 pt-4">
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-2">
                          INFORMACIÓN MÉDICA
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Médico:</span> Dr.{" "}
                          {cirugia.nombre_medico}
                        </p>
                        {cirugia.diagnostico && (
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">Diagnóstico:</span>{" "}
                            {cirugia.diagnostico}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 bg-orange-100 border border-orange-300 rounded-lg p-3">
                      <p className="text-xs text-orange-900 font-medium mb-1">
                        ⚠️ IMPORTANTE
                      </p>
                      <ul className="text-xs text-orange-800 space-y-1">
                        <li>
                          • Confirma tu asistencia con el médico antes de la
                          fecha
                        </li>
                        <li>
                          • Presenta toda la documentación médica requerida
                        </li>
                        <li>
                          • Sigue las instrucciones de preparación del médico
                        </li>
                        <li>• Llega con 30 minutos de anticipación</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cirugías Pasadas */}
          {pasados.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gray-500" />
                Historial de Cirugías
              </h2>
              <div className="space-y-4">
                {pasados.map((cirugia) => (
                  <div
                    key={cirugia.id_cirugia}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cirugia.tipo_cirugia}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {cirugia.especialidad}
                        </p>
                      </div>
                      {getEstadoBadge(cirugia.estado)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Fecha
                        </p>
                        <p className="text-gray-900">
                          {new Date(cirugia.fecha).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Médico
                        </p>
                        <p className="text-gray-900">
                          Dr. {cirugia.nombre_medico}
                        </p>
                      </div>
                      {cirugia.numero_quirofano && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-1">
                            Quirófano
                          </p>
                          <p className="text-gray-900">
                            {cirugia.numero_quirofano}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
