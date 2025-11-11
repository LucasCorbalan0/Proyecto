import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Download, Plus, Edit } from 'lucide-react'

export default function ProductosContent() {
  const initial = [
    { id: 1, nombre: "Paracetamol 500mg", stock: 8, proveedor: "FarmaPlus", vencimiento: "2025-11-30" },
    { id: 2, nombre: "Guantes Nitrilo", stock: 150, proveedor: "MedSupplies", vencimiento: "2027-01-01" },
  ]
  const [items, setItems] = useState(initial)
  const [filter, setFilter] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nombre: "", stock: 0, proveedor: "", vencimiento: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (editing) setForm({ nombre: editing.nombre, stock: editing.stock, proveedor: editing.proveedor, vencimiento: editing.vencimiento }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ nombre: "", stock: 0, proveedor: "", vencimiento: "" }); setModalOpen(true) }
  const openEdit = (it) => { setEditing(it); setModalOpen(true) }

  const save = async () => {
    if (!form.nombre) { toast.error('Nombre requerido'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    if (editing) {
      setItems(items.map(i => i.id === editing.id ? { ...i, ...form } : i))
      toast.success('Producto actualizado (simulado)')
    } else {
      setItems([{ id: Date.now(), ...form }, ...items])
      toast.success('Producto creado (simulado)')
    }
    setModalOpen(false)
    setEditing(null)
    setLoading(false)
  }

  const downloadCSV = () => {
    const csv = ["Nombre,Stock,Proveedor,Vencimiento", ...items.map(i => `${i.nombre},${i.stock},${i.proveedor},${i.vencimiento}`)].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'productos.csv'; a.click(); a.remove()
    toast.success("CSV descargado (simulado)")
  }

  const viewLotes = (item) => {
    toast.info(`Ver lotes de ${item.nombre} (simulado)`)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Productos y Proveedores</h1>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Download className="w-4 h-4" /> Exportar CSV</button>
          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <input placeholder="Buscar producto o proveedor" value={filter} onChange={e => setFilter(e.target.value)} className="rounded-lg border p-2 w-1/3" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Producto</th>
                <th className="px-6 py-3 text-xs text-gray-500">Stock</th>
                <th className="px-6 py-3 text-xs text-gray-500">Proveedor</th>
                <th className="px-6 py-3 text-xs text-gray-500">Vencimiento</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.filter(i => i.nombre.toLowerCase().includes(filter.toLowerCase()) || i.proveedor.toLowerCase().includes(filter.toLowerCase())).map(i => (
                <tr key={i.id}>
                  <td className="px-6 py-4">{i.nombre}</td>
                  <td className={`px-6 py-4 ${i.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>{i.stock}</td>
                  <td className="px-6 py-4">{i.proveedor}</td>
                  <td className="px-6 py-4">{i.vencimiento}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(i)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => viewLotes(i)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">Lotes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-4 text-sm text-gray-500">No hay productos.</p>}
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Stock</label>
            <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Proveedor</label>
            <input value={form.proveedor} onChange={e => setForm({ ...form, proveedor: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Vencimiento</label>
            <input type="date" value={form.vencimiento} onChange={e => setForm({ ...form, vencimiento: e.target.value })} className="w-full rounded-lg border p-2" />
            <div className="flex gap-2 mt-2">
              <button onClick={save} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg">{loading ? 'Guardando...' : 'Guardar'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}