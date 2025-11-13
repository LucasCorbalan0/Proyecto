import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../services/apiClient'

export default function AuditoriaContent() {
  const [logs, setLogs] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchAuditorias = async () => {
      setDataLoading(true)
      try {
        const response = await apiClient.get('/admin/auditorias')
        const data = response.data?.data ?? response.data ?? []
        const normalized = (Array.isArray(data) ? data : []).map(a => ({
          id_auditoria: a.id_auditoria ?? a.id,
          usuario: a.usuario ?? 'N/A',
          accion: a.accion ?? '',
          fecha: a.fecha ? new Date(a.fecha).toLocaleString() : 'N/A'
        }))
        setLogs(normalized)
      } catch (error) {
        console.error('Error al cargar auditorías:', error)
        toast.error('Error al cargar auditorías')
        setLogs([])
      } finally {
        setDataLoading(false)
      }
    }

    fetchAuditorias()
  }, [])

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Auditoría</h1>
      <p className="text-gray-600 mb-4">Registro de eventos del sistema y cambios importantes.</p>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        {dataLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando auditorías...</p>
          </div>
        ) : logs.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No hay registros de auditoría.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500">Usuario</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Acción</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Fecha / Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map(l => (
                  <tr key={l.id_auditoria}>
                    <td className="px-6 py-4">{l.usuario}</td>
                    <td className="px-6 py-4">{l.accion}</td>
                    <td className="px-6 py-4">{l.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

