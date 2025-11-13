import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../services/apiClient'

export default function ReportesContent() {
  const [reportData, setReportData] = useState({ totalUsuarios: 0, totalPacientes: 0, totalMedicos: 0, camasOcupadas: 0, totalRecaudado: 0, totalPendiente: 0 })
  const [generating, setGenerating] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchReportes = async () => {
      setDataLoading(true)
      try {
        const response = await apiClient.get('/admin/reportes')
        const data = response.data?.data ?? response.data ?? {}
        setReportData({
          totalUsuarios: data.totalUsuarios ?? 0,
          totalPacientes: data.totalPacientes ?? 0,
          totalMedicos: data.totalMedicos ?? 0,
          camasOcupadas: data.camasOcupadas ?? 0,
          totalRecaudado: data.totalRecaudado ?? 0,
          totalPendiente: data.totalPendiente ?? 0
        })
      } catch (error) {
        console.error('Error al cargar reportes:', error)
        toast.error('Error al cargar reportes')
      } finally {
        setDataLoading(false)
      }
    }
    fetchReportes()
  }, [])

  const gen = async (tipo) => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 900))
    setGenerating(false)
    toast.success(`${tipo} generado`)
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Reportes</h1>
      <p className="text-gray-600 mb-6">Estadísticas en tiempo real del hospital.</p>

      {dataLoading ? (
        <div className="text-center py-8"><p className="text-gray-500">Cargando reportes...</p></div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-600">Total Usuarios</h3>
              <p className="text-3xl font-bold mb-2">{reportData.totalUsuarios}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-600">Total Pacientes</h3>
              <p className="text-3xl font-bold mb-2">{reportData.totalPacientes}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-600">Total Médicos</h3>
              <p className="text-3xl font-bold mb-2">{reportData.totalMedicos}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-600">Camas Ocupadas</h3>
              <p className="text-3xl font-bold mb-2">{reportData.camasOcupadas}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-600">Total Recaudado</h3>
              <p className="text-3xl font-bold mb-2">${typeof reportData.totalRecaudado === 'number' ? reportData.totalRecaudado.toFixed(2) : '0.00'}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-600">Facturación Pendiente</h3>
              <p className="text-3xl font-bold mb-2">${typeof reportData.totalPendiente === 'number' ? reportData.totalPendiente.toFixed(2) : '0.00'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold mb-4">Generar reporte personalizado</h3>
            <div className="flex gap-2">
              <select className="rounded-lg border p-2">
                <option>Últimos 30 días</option>
                <option>Últimos 3 meses</option>
                <option>Año fiscal</option>
              </select>
              <button onClick={() => gen('Reporte personalizado')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{generating ? 'Generando...' : 'Generar'}</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}