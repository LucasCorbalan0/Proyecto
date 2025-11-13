import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus } from 'lucide-react'
import apiClient from '../../services/apiClient'

export default function ComprasContent() {
  const [purchases, setPurchases] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ id_proveedor: "", estado: "Pendiente" })
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchCompras = async () => {
      setDataLoading(true)
      try {
        const response = await apiClient.get('/admin/compras')
        const data = response.data?.data ?? response.data ?? []
        const normalized = (Array.isArray(data) ? data : []).map(c => ({
          id_compra: c.id_compra ?? c.id,
          proveedor: c.proveedor ?? 'N/A',
          fecha_pedido: c.fecha_pedido ? new Date(c.fecha_pedido).toLocaleDateString() : 'N/A',
          estado: c.estado ?? 'Pendiente',
          items: c.items ?? 0,
          total: c.total ?? 0
        }))
        setPurchases(normalized)
      } catch (error) {
        console.error('Error al cargar compras:', error)
        toast.error('Error al cargar compras')
        setPurchases([])
      } finally {
        setDataLoading(false)
      }
    }
    fetchCompras()
  }, [])

  const register = async () => {
    if (!form.id_proveedor) { toast.error("Seleccionar proveedor"); return }
    setLoading(true)
    try {
      const response = await apiClient.post('/admin/compras', form)
      toast.success("Compra registrada")
      setForm({ id_proveedor: "", estado: "Pendiente" })
      setModalOpen(false)
      // Recargar compras
      const response2 = await apiClient.get('/admin/compras')
      const data = response2.data?.data ?? response2.data ?? []
      const normalized = (Array.isArray(data) ? data : []).map(c => ({
        id_compra: c.id_compra ?? c.id,
        proveedor: c.proveedor ?? 'N/A',
        fecha_pedido: c.fecha_pedido ? new Date(c.fecha_pedido).toLocaleDateString() : 'N/A',
        estado: c.estado ?? 'Pendiente',
        items: c.items ?? 0,
        total: c.total ?? 0
      }))
      setPurchases(normalized)
    } catch (error) {
      console.error('Error al registrar compra:', error)
      toast.error('Error al registrar compra')
    } finally {
      setLoading(false)
    }
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
        {dataLoading ? (
          <div className="text-center py-8"><p className="text-gray-500">Cargando compras...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500">Proveedor</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Fecha</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Total</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Items</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {purchases.map(p => (
                  <tr key={p.id_compra}>
                    <td className="px-6 py-4">{p.proveedor}</td>
                    <td className="px-6 py-4">{p.fecha_pedido}</td>
                    <td className="px-6 py-4">${typeof p.total === 'number' ? p.total.toFixed(2) : '0.00'}</td>
                    <td className="px-6 py-4">{p.items}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${p.estado === 'Recibida' ? 'bg-green-100 text-green-800' : p.estado === 'Cancelada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {purchases.length === 0 && <p className="p-4 text-sm text-gray-500">No hay compras registradas.</p>}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">Nueva compra</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Proveedor ID</label>
            <input type="number" value={form.id_proveedor} onChange={e => setForm({ ...form, id_proveedor: e.target.value })} className="w-full rounded-lg border p-2" placeholder="ID del proveedor" />
            <label className="text-sm text-gray-500">Estado</label>
            <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="w-full rounded-lg border p-2">
              <option>Pendiente</option>
              <option>Recibida</option>
              <option>Cancelada</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button onClick={register} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Registrando...' : 'Registrar'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}