import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Download } from 'lucide-react'
import { jsPDF } from 'jspdf'

export default function FacturacionContent() {
  const invoices = [
    { id: 1, numero: "FAC-2025-0342", fecha: "2025-03-20", concepto: "Internación", monto: 250000, estado: "Pendiente" },
    { id: 2, numero: "FAC-2025-0298", fecha: "2025-02-28", concepto: "Consulta", monto: 8500, estado: "Pagada" },
  ]
  const [payments, setPayments] = useState([])
  const [selected, setSelected] = useState(null)
  const [modalPayOpen, setModalPayOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [payForm, setPayForm] = useState({ monto: 0, metodo: "Transferencia" })

  const openPayModal = (inv) => { setSelected(inv); setPayForm({ monto: inv.monto, metodo: "Transferencia" }); setModalPayOpen(true) }

  const registerPartial = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setPayments([{ id: Date.now(), facturaId: selected.id, fecha: new Date().toLocaleDateString(), monto: Number(payForm.monto), metodo: payForm.metodo }, ...payments])
    toast.success("Pago registrado (simulado)")
    setModalPayOpen(false)
    setLoading(false)
  }

  const exportResumenPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Resumen Facturación", 20, 20)
    let y = 40
    invoices.forEach(inv => { doc.setFontSize(12); doc.text(`${inv.numero} — ${inv.concepto} — $${inv.monto.toLocaleString()} — ${inv.estado}`, 20, y); y += 8 })
    doc.save("resumen_facturacion.pdf")
    toast.success("PDF descargado (simulado)")
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500">N°</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Fecha</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Concepto</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Monto</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map(inv => (
                  <tr key={inv.id} onClick={() => setSelected(inv)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">{inv.numero}</td>
                    <td className="px-6 py-4">{inv.fecha}</td>
                    <td className="px-6 py-4">{inv.concepto}</td>
                    <td className="px-6 py-4">${inv.monto.toLocaleString()}</td>
                    <td className="px-6 py-4">{inv.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4">Detalle / Registrar pago</h3>
          {selected ? (
            <>
              <p className="text-sm text-gray-600 mb-2">Factura: <span className="font-medium">{selected.numero}</span></p>
              <p className="text-sm text-gray-600 mb-4">Monto: <span className="font-medium">${selected.monto.toLocaleString()}</span></p>
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