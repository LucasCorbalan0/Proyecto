import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus, Edit } from 'lucide-react'
import apiClient from '../../services/apiClient'

export default function PrestacionesContent() {
  const [prestaciones, setPrestaciones] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ descripcion: "", precio: 0 })
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchPrestaciones = async () => {
      setDataLoading(true)
      try {
        const response = await apiClient.get('/admin/prestaciones')
        const data = response.data?.data ?? response.data ?? []
        const normalized = (Array.isArray(data) ? data : []).map(p => ({
          id_prestacion: p.id_prestacion ?? p.id,
          descripcion: p.descripcion ?? '',
          precio: p.precio ?? 0
        }))
        setPrestaciones(normalized)
      } catch (error) {
        console.error('Error al cargar prestaciones:', error)
        toast.error('Error al cargar prestaciones')
        setPrestaciones([])
      } finally {
        setDataLoading(false)
      }
    }
    fetchPrestaciones()
  }, [])

  useEffect(() => { if (editing) setForm({ descripcion: editing.descripcion, precio: editing.precio }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ descripcion: "", precio: 0 }); setModalOpen(true) }
  const openEdit = (p) => { setEditing(p); setModalOpen(true) }

  const save = async () => {
    if (!form.descripcion || !form.precio) { toast.error('Descripción y precio requeridos'); return }
    setLoading(true)
    try {
      if (editing) {
        await apiClient.put(`/admin/prestaciones/${editing.id_prestacion}`, form)
        setPrestaciones(prestaciones.map(p => p.id_prestacion === editing.id_prestacion ? { ...p, ...form } : p))
        toast.success('Prestación actualizada')
      } else {
        const response = await apiClient.post('/admin/prestaciones', form)
        const newId = response.data?.id_prestacion || Date.now()
        setPrestaciones([{ id_prestacion: newId, ...form }, ...prestaciones])
        toast.success('Prestación creada')
      }
      setModalOpen(false)
      setLoading(false)
      setEditing(null)
    } catch (error) {
      console.error('Error al guardar prestación:', error)
      toast.error('Error al guardar prestación')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Prestaciones y Precios</h1>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        {dataLoading ? (
          <div className="text-center py-8"><p className="text-gray-500">Cargando prestaciones...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500">Descripción</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Precio</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {prestaciones.map(p => (
                  <tr key={p.id_prestacion}>
                    <td className="px-6 py-4">{p.descripcion}</td>
                    <td className="px-6 py-4">${typeof p.precio === 'number' ? p.precio.toFixed(2) : p.precio}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEdit(p)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {prestaciones.length === 0 && <p className="p-4 text-sm text-gray-500">No hay prestaciones.</p>}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar prestación' : 'Nueva prestación'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Descripción</label>
            <input value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Precio</label>
            <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: Number(e.target.value) })} className="w-full rounded-lg border p-2" />
            <div className="flex gap-2 mt-2">
              <button onClick={save} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Guardando...' : 'Guardar'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}