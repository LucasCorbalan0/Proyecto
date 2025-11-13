import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Download, Plus, Edit } from 'lucide-react'
import apiClient from '../../services/apiClient'

export default function ProductosContent() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nombre: "", descripcion: "", tipo_producto: "Medicamento" })
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchProductos = async () => {
      setDataLoading(true)
      try {
        const response = await apiClient.get('/admin/productos')
        const data = response.data?.data ?? response.data ?? []
        const normalized = (Array.isArray(data) ? data : []).map(p => ({
          id_producto: p.id_producto ?? p.id,
          nombre: p.nombre ?? '',
          descripcion: p.descripcion ?? '',
          tipo_producto: p.tipo_producto ?? 'Medicamento'
        }))
        setItems(normalized)
      } catch (error) {
        console.error('Error al cargar productos:', error)
        toast.error('Error al cargar productos')
        setItems([])
      } finally {
        setDataLoading(false)
      }
    }
    fetchProductos()
  }, [])

  useEffect(() => { if (editing) setForm({ nombre: editing.nombre, descripcion: editing.descripcion, tipo_producto: editing.tipo_producto }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ nombre: "", descripcion: "", tipo_producto: "Medicamento" }); setModalOpen(true) }
  const openEdit = (it) => { setEditing(it); setModalOpen(true) }

  const save = async () => {
    if (!form.nombre) { toast.error('Nombre requerido'); return }
    setLoading(true)
    try {
      if (editing) {
        await apiClient.put(`/admin/productos/${editing.id_producto}`, form)
        setItems(items.map(i => i.id_producto === editing.id_producto ? { ...i, ...form } : i))
        toast.success('Producto actualizado')
      } else {
        const response = await apiClient.post('/admin/productos', form)
        const newId = response.data?.id_producto || Date.now()
        setItems([{ id_producto: newId, ...form }, ...items])
        toast.success('Producto creado')
      }
      setModalOpen(false)
      setEditing(null)
    } catch (error) {
      console.error('Error al guardar producto:', error)
      toast.error('Error al guardar producto')
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    const csv = ["Nombre,Descripción,Tipo", ...items.map(i => `${i.nombre},"${i.descripcion}",${i.tipo_producto}`)].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'productos.csv'; a.click(); a.remove()
    toast.success("CSV descargado")
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
          <input placeholder="Buscar producto" value={filter} onChange={e => setFilter(e.target.value)} className="rounded-lg border p-2 w-1/3" />
        </div>

        {dataLoading ? (
          <div className="text-center py-8"><p className="text-gray-500">Cargando productos...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500">Producto</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Descripción</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Tipo</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.filter(i => i.nombre.toLowerCase().includes(filter.toLowerCase())).map(i => (
                  <tr key={i.id_producto}>
                    <td className="px-6 py-4">{i.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{i.descripcion}</td>
                    <td className="px-6 py-4 text-sm">{i.tipo_producto}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEdit(i)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <p className="p-4 text-sm text-gray-500">No hay productos.</p>}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Descripción</label>
            <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="w-full rounded-lg border p-2" rows="3" />
            <label className="text-sm text-gray-500">Tipo</label>
            <select value={form.tipo_producto} onChange={e => setForm({ ...form, tipo_producto: e.target.value })} className="w-full rounded-lg border p-2">
              <option>Medicamento</option>
              <option>Insumo</option>
              <option>Material Quirurgico</option>
            </select>
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