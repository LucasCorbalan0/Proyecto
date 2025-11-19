import { useState, useEffect } from "react";
import { Calendar, Clock, FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";

export function InicioContent({ setActive }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    consultasHoy: 0,
    consultasPendientes: 0,
    recetasGen: 0,
    disponibilidadActiva: false,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get(`/medicos/${user?.id_medico}/stats`);
      setStats(response.data?.data || response.data || {});
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      setStats({
        consultasHoy: 0,
        consultasPendientes: 0,
        recetasGen: 0,
        disponibilidadActiva: true,
      });
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.nombre || "Médico"}
        </h2>
        <p className="text-gray-600">
          Especialidad: {user?.especialidad || "Medicina General"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Consultas Hoy */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Consultas hoy</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.consultasHoy}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Consultas Pendientes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.consultasPendientes}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Recetas Generadas */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recetas hoy</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.recetasGen}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Estudios solicitados</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.estudiosSolicitados || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setActive("agenda")}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer text-left"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Ver Agenda
              </h3>
              <p className="text-sm text-gray-600">
                Consulta los turnos en espera
              </p>
            </div>
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </button>

        <button
          onClick={() => setActive("disponibilidad")}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer text-left"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Configurar Disponibilidad
              </h3>
              <p className="text-sm text-gray-600">
                Define tus horarios de atención
              </p>
            </div>
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
        </button>

        <button
          onClick={() => setActive("consultas")}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer text-left"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Registrar Consulta
              </h3>
              <p className="text-sm text-gray-600">
                Documenta diagnóstico y tratamiento
              </p>
            </div>
            <FileText className="w-6 h-6 text-green-600" />
          </div>
        </button>

        <button
          onClick={() => setActive("recetas")}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer text-left"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Crear Receta
              </h3>
              <p className="text-sm text-gray-600">
                Genera recetas electrónicas
              </p>
            </div>
            <Plus className="w-6 h-6 text-orange-600" />
          </div>
        </button>
      </div>
    </div>
  );
}
