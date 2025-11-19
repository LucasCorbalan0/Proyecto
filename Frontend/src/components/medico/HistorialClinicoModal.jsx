import { useState, useEffect } from "react";
import { X, Download, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../services/apiClient";

export function HistorialClinicoModal({
  id_paciente,
  pacienteNombre,
  onClose,
}) {
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("base");

  useEffect(() => {
    loadHistorial();
  }, [id_paciente]);

  const loadHistorial = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/medicos/paciente/${id_paciente}/historial-clinico`
      );
      const data = response.data?.data || response.data || {};
      setHistorial(data);
    } catch (error) {
      console.error("Error cargando historial:", error);
      toast.error(
        "Error al cargar el historial clínico. Verifique que el paciente existe."
      );
      // Mantener estado para mostrar error en UI
      setHistorial({ error: true, errorMessage: error.message });
    } finally {
      setLoading(false);
    }
  };

  const calcularEdad = (fecha_nacimiento) => {
    if (!fecha_nacimiento) return "N/A";
    const hoy = new Date();
    const nacimiento = new Date(fecha_nacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  const datos = historial.datosBasicos || {};
  const consultas = historial.consultas || [];
  const recetas = historial.recetas || [];
  const estudios = historial.estudios || [];
  const cirugias = historial.cirugias || [];

  // Mostrar error si ocurrió
  if (historial.error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h3 className="font-semibold text-lg">Error al cargar historial</h3>
          </div>
          <p className="text-gray-600 mb-6">
            No se pudo cargar el historial clínico del paciente. Verifique que
            el paciente existe y tiene historia clínica registrada.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Historial Clínico</h2>
            <p className="text-blue-100">
              {datos.nombre} {datos.apellido} - {datos.dni}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-600 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex gap-4 px-6 py-4 overflow-x-auto">
            {[
              { id: "base", label: "Datos Básicos" },
              { id: "consultas", label: `Consultas (${consultas.length})` },
              { id: "recetas", label: `Recetas (${recetas.length})` },
              { id: "estudios", label: `Estudios (${estudios.length})` },
              { id: "cirugias", label: `Cirugías (${cirugias.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 whitespace-nowrap font-medium transition ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* DATOS BÁSICOS */}
          {activeTab === "base" && (
            <div className="space-y-6">
              {/* Info Personal */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Información Personal
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre Completo</p>
                    <p className="font-medium">
                      {datos.nombre} {datos.apellido}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">DNI</p>
                    <p className="font-medium">{datos.dni}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Edad</p>
                    <p className="font-medium">
                      {calcularEdad(datos.fecha_nacimiento)} años
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{datos.telefono}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{datos.email}</p>
                  </div>
                </div>
              </div>

              {/* Datos Médicos */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Datos Médicos
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Sangre</p>
                    <p className="font-bold text-lg text-red-600">
                      {datos.tipo_sangre || "No registrado"}{" "}
                      {datos.factor_rh || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Creación</p>
                    <p className="font-medium">
                      {formatDate(datos.fecha_creacion)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Alergias */}
              {datos.alergias_conocidas && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">
                        Alergias Conocidas
                      </h4>
                      <p className="text-yellow-900 mt-1">
                        {datos.alergias_conocidas}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comorbilidades */}
              {datos.comorbilidades_cronicas && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Comorbilidades Crónicas
                  </h4>
                  <p className="text-orange-900">
                    {datos.comorbilidades_cronicas}
                  </p>
                </div>
              )}

              {/* Medicación Habitual */}
              {datos.medicacion_habitual && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Medicación Habitual
                  </h4>
                  <p className="text-blue-900">{datos.medicacion_habitual}</p>
                </div>
              )}

              {/* Antecedentes Quirúrgicos */}
              {datos.antecedentes_quirurgicos && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Antecedentes Quirúrgicos
                  </h4>
                  <p className="text-purple-900">
                    {datos.antecedentes_quirurgicos}
                  </p>
                </div>
              )}

              {/* Contacto de Emergencia */}
              {datos.contacto_emergencia_nombre && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Contacto de Emergencia
                  </h4>
                  <p className="text-gray-700">
                    {datos.contacto_emergencia_nombre}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {datos.contacto_emergencia_telefono}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CONSULTAS */}
          {activeTab === "consultas" && (
            <div className="space-y-4">
              {consultas.length > 0 ? (
                consultas.map((consulta) => (
                  <div
                    key={consulta.id_consulta}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatDate(consulta.fecha_consulta)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Dr/a. {consulta.nombre_medico}{" "}
                          {consulta.apellido_medico}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Motivo:</p>
                        <p className="text-gray-900">
                          {consulta.motivo_consulta}
                        </p>
                      </div>
                      {consulta.diagnostico && (
                        <div>
                          <p className="text-gray-600">Diagnóstico:</p>
                          <p className="text-gray-900">
                            {consulta.diagnostico}
                          </p>
                        </div>
                      )}
                      {consulta.tratamiento && (
                        <div>
                          <p className="text-gray-600">Tratamiento:</p>
                          <p className="text-gray-900">
                            {consulta.tratamiento}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No hay consultas registradas
                </p>
              )}
            </div>
          )}

          {/* RECETAS */}
          {activeTab === "recetas" && (
            <div className="space-y-4">
              {recetas.length > 0 ? (
                recetas.map((receta) => (
                  <div
                    key={receta.id_receta}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Receta #{receta.id_receta}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(receta.fecha_emision)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Dr/a. {receta.nombre_medico} {receta.apellido_medico}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                        {receta.total_medicamentos} medicamento
                        {receta.total_medicamentos !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No hay recetas registradas
                </p>
              )}
            </div>
          )}

          {/* ESTUDIOS */}
          {activeTab === "estudios" && (
            <div className="space-y-4">
              {estudios.length > 0 ? (
                estudios.map((estudio) => (
                  <div
                    key={estudio.id_estudio}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {estudio.tipo_estudio}
                        </p>
                        <p className="text-sm text-gray-600">
                          Solicitado: {formatDate(estudio.fecha_solicitud)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Dr/a. {estudio.nombre_medico}{" "}
                          {estudio.apellido_medico}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          estudio.estado === "Resultado Disponible"
                            ? "bg-green-100 text-green-800"
                            : estudio.estado === "Realizado"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {estudio.estado}
                      </span>
                    </div>
                    {estudio.fecha_resultado && (
                      <p className="text-sm text-gray-600">
                        Resultado: {formatDate(estudio.fecha_resultado)}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No hay estudios registrados
                </p>
              )}
            </div>
          )}

          {/* CIRUGÍAS */}
          {activeTab === "cirugias" && (
            <div className="space-y-4">
              {cirugias.length > 0 ? (
                cirugias.map((cirugia) => (
                  <div
                    key={cirugia.id_cirugia}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {cirugia.tipo_cirugia}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(cirugia.fecha_programada)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Dr/a. {cirugia.nombre_medico}{" "}
                          {cirugia.apellido_medico}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          cirugia.estado === "Realizada"
                            ? "bg-green-100 text-green-800"
                            : cirugia.estado === "Cancelada"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {cirugia.estado}
                      </span>
                    </div>
                    {cirugia.nombre_quirofano && (
                      <p className="text-sm text-gray-600">
                        Quirófano: {cirugia.nombre_quirofano}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No hay cirugías registradas
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex gap-3 justify-end sticky bottom-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
