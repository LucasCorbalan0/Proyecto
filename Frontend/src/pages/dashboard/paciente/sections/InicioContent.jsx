import { useState, useEffect } from "react"
import { toast } from 'react-hot-toast'
import { Calendar, FlaskConical, Pill, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import apiClient from '../../../../services/apiClient'

export function InicioContent() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let idPaciente = localStorage.getItem('id_paciente');
      const token = localStorage.getItem('token');
      
      // TODO: Remover esto cuando tengas login funcionando
      // Por ahora usa ID de prueba si no está logueado
      if (!idPaciente) {
        idPaciente = '1'; // Cambiar según tu base de datos
        console.log('TESTEO: Usando ID de paciente de prueba:', idPaciente);
      }

      const response = await apiClient.get(`/pacientes/dashboard/${idPaciente}`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      if (response.data.data) {
        setDashboardData(response.data.data);
      } else if (response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error('No se recibieron datos del servidor');
      }
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      } else {
        toast.error(err.response?.data?.message || 'Error al cargar la información del dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelarTurno = async (idTurno) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      await apiClient.put(`/pacientes/turnos/${idTurno}/cancelar`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Turno cancelado exitosamente');
      fetchDashboardData();
    } catch (err) {
      console.error('Error al cancelar turno:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      } else {
        toast.error('Error al cancelar el turno. Por favor intente nuevamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { paciente, proximosTurnos, ultimosEstudios, recetasProximasVencer } = dashboardData;

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Hola, {paciente?.nombre || 'Paciente'}.
      </h1>

      {/* Información Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Próximo Turno</h3>
              <p className="text-sm text-gray-600 mt-1">
                {proximosTurnos[0] ? (
                  `${new Date(proximosTurnos[0].fecha).toLocaleDateString()} - ${proximosTurnos[0].hora_inicio}`
                ) : (
                  'No hay turnos programados'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Últimos Estudios</h3>
              <p className="text-sm text-gray-600 mt-1">
                {ultimosEstudios.length ? 
                  `${ultimosEstudios.length} resultados disponibles` : 
                  'No hay estudios recientes'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <Pill className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Recetas Activas</h3>
              <p className="text-sm text-gray-600 mt-1">
                {recetasProximasVencer.length ? 
                  `${recetasProximasVencer.length} recetas vigentes` : 
                  'No hay recetas activas'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Turnos Section */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Turnos</h2>
        <div className="space-y-4">
          {proximosTurnos.length > 0 ? (
            proximosTurnos.map((turno) => (
              <div key={turno.id_turno} className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(turno.fecha).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })} / {turno.hora_inicio}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">Dr. {turno.nombre_medico}</h3>
                    <p className="text-gray-600">{turno.especialidad}</p>
                  </div>
                  <button
                    onClick={() => handleCancelarTurno(turno.id_turno)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancelar Turno
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-8">
              No tienes turnos programados
            </div>
          )}
        </div>

        <Link 
          to="/dashboard/buscar-medicos"
          className="block w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg text-center"
        >
          Solicitar Nuevo Turno
        </Link>
      </div>

      {/* Últimos Resultados Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos Resultados</h2>
        {ultimosEstudios.length > 0 ? (
          <div className="space-y-2">
            {ultimosEstudios.map((estudio) => (
              <div key={estudio.id_estudio} className="flex items-center justify-between">
                <a 
                  href={estudio.ruta_resultado_pdf} 
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {estudio.tipo_estudio}
                </a>
                <span className="text-sm text-gray-600">
                  {new Date(estudio.fecha_resultado).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-4">
            No hay resultados disponibles
          </div>
        )}
      </div>
    </>
  )
}
