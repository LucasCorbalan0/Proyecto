import { useState } from 'react'

export default function AuditoriaContent() {
  const [logs] = useState([
    { id: 1, who: "admin", action: "Creó usuario Dr. Juan Pérez", when: "2025-04-10 09:12" },
    { id: 2, who: "sistema", action: "Stock Paracetamol modificado", when: "2025-04-11 14:03" },
  ])

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Auditoría</h1>
      <p className="text-gray-600 mb-4">Registro de eventos del sistema y cambios importantes.</p>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
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
                <tr key={l.id}>
                  <td className="px-6 py-4">{l.who}</td>
                  <td className="px-6 py-4">{l.action}</td>
                  <td className="px-6 py-4">{l.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}