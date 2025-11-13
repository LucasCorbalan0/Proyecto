import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import apiClient from '../../services/apiClient'

export default function FacturacionContent() {
  const [facturas, setFacturas] = useState([])
  const [payments, setPayments] = useState([])
  const [selected, setSelected] = useState(null)
  const [modalPayOpen, setModalPayOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [payForm, setPayForm] = useState({ monto: 0, metodo: "Transferencia" })

  useEffect(() => {
    const fetchFacturas = async () => {
      setDataLoading(true)
      try {
        const response = await apiClient.get('/admin/facturas')
        const data = response.data?.data ?? response.data ?? []
        const normalized = (Array.isArray(data) ? data : []).map(f => ({
          id_factura: f.id_factura ?? f.id,
          paciente: f.paciente ?? 'N/A',
          fecha_emision: f.fecha_emision ? new Date(f.fecha_emision).toLocaleDateString() : 'N/A',
          total: f.total ?? 0,
          estado_pago: f.estado_pago ?? 'Pendiente'
        }))
        setFacturas(normalized)
      } catch (error) {
        console.error('Error al cargar facturas:', error)
        toast.error('Error al cargar facturas')
        setFacturas([])
      } finally {
        setDataLoading(false)
      }
    }
    fetchFacturas()
  }, [])

  const openPayModal = (inv) => { setSelected(inv); setPayForm({ monto: inv.total, metodo: "Transferencia" }); setModalPayOpen(true) }

  const registerPartial = async () => {
    setLoading(true)
    try {
      await apiClient.post(`/admin/pagos`, { id_factura: selected.id_factura, monto_pago: payForm.monto, metodo_pago: payForm.metodo })
      setPayments([{ id: Date.now(), facturaId: selected.id_factura, fecha: new Date().toLocaleDateString(), monto: Number(payForm.monto), metodo: payForm.metodo }, ...payments])
      toast.success("Pago registrado")
      setModalPayOpen(false)
    } catch (error) {
      console.error('Error al registrar pago:', error)
      toast.error('Error al registrar pago')
    } finally {
      setLoading(false)
    }
  }

  const exportResumenPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Resumen Facturación", 20, 20)
    let y = 40
    facturas.forEach(f => { doc.setFontSize(12); doc.text(`${f.paciente} — $${typeof f.total === 'number' ? f.total.toFixed(2) : f.total} — ${f.estado_pago}`, 20, y); y += 8 })
    doc.save("resumen_facturacion.pdf")
    toast.success("PDF descargado")
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
        <div className="flex gap-2">
          <button onClick={exportResumenPDF} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Download className="w-4 h-4" />Exportar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4">Facturas</h3>
          {dataLoading ? (
            <div className="text-center py-8"><p className="text-gray-500">Cargando facturas...</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-xs text-gray-500">Paciente</th>
                    <th className="px-6 py-3 text-xs text-gray-500">Fecha</th>
                    <th className="px-6 py-3 text-xs text-gray-500">Monto</th>
                    <th className="px-6 py-3 text-xs text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {facturas.map(f => (
                    <tr key={f.id_factura} onClick={() => setSelected(f)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4">{f.paciente}</td>
                      <td className="px-6 py-4">{f.fecha_emision}</td>
                      <td className="px-6 py-4">${typeof f.total === 'number' ? f.total.toFixed(2) : f.total}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${f.estado_pago === 'Pagada' ? 'bg-green-100 text-green-800' : f.estado_pago === 'Anulada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{f.estado_pago}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {facturas.length === 0 && <p className="p-4 text-sm text-gray-500">No hay facturas.</p>}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4">Detalle / Registrar pago</h3>
          {selected ? (
            <>
              <p className="text-sm text-gray-600 mb-2">Factura: <span className="font-medium">{selected.id_factura}</span></p>
              <p className="text-sm text-gray-600 mb-4">Monto: <span className="font-medium">${selected.total?.toLocaleString()}</span></p>
              <div className="flex gap-2">
                <button onClick={() => openPayModal(selected)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Registrar Pago</button>
                <button onClick={() => toast('Abrir modal pagos compuestos (simulado)')} className="px-4 py-2 bg-blue-50 rounded-lg">Pago complejo</button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Seleccione una factura para ver detalle y registrar pagos.</p>
          )}

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Historial de pagos (simulado)</h4>
            {payments.length === 0 ? <p className="text-sm text-gray-500">Sin pagos registrados.</p> : (
              <ul className="space-y-2">{payments.map(p => <li key={p.id} className="text-sm text-gray-700">{p.fecha} — ${p.monto.toLocaleString()} — {p.metodo}</li>)}</ul>
            )}
          </div>
        </div>
      </div>

      {modalPayOpen && (
        <Modal onClose={() => setModalPayOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">Registrar pago</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Monto</label>
            <input type="number" value={payForm.monto} onChange={e => setPayForm({ ...payForm, monto: Number(e.target.value) })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Método</label>
            <select value={payForm.metodo} onChange={e => setPayForm({ ...payForm, metodo: e.target.value })} className="w-full rounded-lg border p-2">
              <option>Transferencia</option>
              <option>Tarjeta</option>
              <option>Efectivo</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button onClick={registerPartial} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg">{loading ? 'Registrando...' : 'Registrar pago'}</button>
              <button onClick={() => setModalPayOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}