import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Calendar, Download } from 'lucide-react'
import apiClient from '../../../../services/apiClient'

export function ConsultasContent() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const idPaciente = localStorage.getItem('id_paciente');
        const token = localStorage.getItem('token');
        
        if (!idPaciente || !token) {
          throw new Error('No se encontró el ID del paciente o el token');
        }
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await apiClient.get(`/pacientes/consultas/${idPaciente}`);
        
        if (!response.data) {
          throw new Error('No se recibieron datos del servidor');
        }
        
        // Extraer datos correctamente
        const consultasData = response.data.data || response.data;
        setConsultas(Array.isArray(consultasData) ? consultasData : []);
        setError(null);
      } catch (err) {
        console.error('Error al cargar consultas:', err);
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/';
        } else {
          setError(err.response?.data?.message || 'Error al cargar el historial de consultas');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConsultas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Historial de Consultas</h1>
      <div className="space-y-4">
        {consultas.map((consulta, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600">{consulta.fecha}</p>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{consulta.medico}</h3>
                <p className="text-blue-600">{consulta.especialidad}</p>
              </div>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Motivo de consulta</p>
                <p className="text-gray-900">{consulta.motivo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Diagnóstico</p>
                <p className="text-gray-900">{consulta.diagnostico}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tratamiento</p>
                <p className="text-gray-900">{consulta.tratamiento}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
