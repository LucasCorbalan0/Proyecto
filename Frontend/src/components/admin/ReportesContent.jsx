import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ReportesContent() {
  const reportData = { ocupacion: 74, stockBajo: 12, facturacionPendiente: 420000 }
  const [generating, setGenerating] = useState(false)

  const gen = async (tipo) => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 900))
    setGenerating(false)
    toast.success(`${tipo} generado (simulado)`)
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Reportes</h1>
      <p className="text-gray-600 mb-6">Generación de reportes: ocupación, stock bajo, facturación pendiente.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-2">Ocupación</h3>
          <p className="text-3xl font-bold mb-2">{reportData.ocupacion}%</p>
          <button onClick={() => gen('Reporte de ocupación')} className="px-3 py-2 bg-blue-600 text-white rounded-lg">{generating ? 'Generando...' : 'Exportar PDF'}</button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-2">Stock bajo</h3>
          <p className="text-3xl font-bold mb-2">{reportData.stockBajo}</p>
          <button onClick={() => gen('Reporte de stock')} className="px-3 py-2 bg-blue-600 text-white rounded-lg">{generating ? 'Generando...' : 'Exportar CSV'}</button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-2">Facturación pendiente</h3>
          <p className="text-3xl font-bold mb-2">${reportData.facturacionPendiente.toLocaleString()}</p>
          <button onClick={() => gen('Reporte de facturación pendiente')} className="px-3 py-2 bg-blue-600 text-white rounded-lg">{generating ? 'Generando...' : 'Exportar'}</button>
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
  )
}