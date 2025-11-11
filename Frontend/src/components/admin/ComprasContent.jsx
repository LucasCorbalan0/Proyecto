import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus } from 'lucide-react'

export default function ComprasContent() {
  const [purchases, setPurchases] = useState([
    { id: 1, proveedor: "FarmaPlus", fecha: "2025-04-10", total: 120000, items: 10 },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ producto: "", lote: "", vencimiento: "", cantidad: 0 })
  const [loading, setLoading] = useState(false)

  const register = async () => {
    if (!form.producto || !form.lote) { toast.error("Completar datos del lote"); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setPurchases([{ id: Date.now(), proveedor: "Proveedor X", fecha: new Date().toLocaleDateString(), total: 0, items: form.cantidad }, ...purchases])
    toast.success("Compra registrada & stock ingresado (simulado)")
    setForm({ producto: "", lote: "", vencimiento: "", cantidad: 0 })
    setModalOpen(false)
    setLoading(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Compras y Stock (lote + vencimiento)</h1>
        <div>
          <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Ingresar lote</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold mb-4">Compras recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Proveedor</th>
                <th className="px-6 py-3 text-xs text-gray-500">Fecha</th>
                <th className="px-6 py-3 text-xs text-gray-500">Total</th>
                <th className="px-6 py-3 text-xs text-gray-500">Items</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {purchases.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.proveedor}</td>
                  <td className="px-6 py-4">{p.fecha}</td>
                  <td className="px-6 py-4">${p.total.toLocaleString()}</td>
                  <td className="px-6 py-4">{p.items}</td>
                  <td className="px-6 py-4"><button onClick={() => toast('Detalle (simulado)')} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">Detalle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">Ingresar stock por lote</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Producto</label>
            <input value={form.producto} onChange={e => setForm({ ...form, producto: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Lote</label>
            <input value={form.lote} onChange={e => setForm({ ...form, lote: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Vencimiento</label>
            <input type="date" value={form.vencimiento} onChange={e => setForm({ ...form, vencimiento: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Cantidad</label>
            <input type="number" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} className="w-full rounded-lg border p-2" />
            <div className="flex gap-2 mt-2">
              <button onClick={register} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Registrando...' : 'Registrar compra'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}