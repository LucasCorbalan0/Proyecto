import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus, Edit } from 'lucide-react'

export default function PrestacionesContent() {
  const [prestaciones, setPrestaciones] = useState([
    { id: 1, codigo: "P-001", nombre: "Consulta de Clínica", precio: 8000 },
    { id: 2, codigo: "P-002", nombre: "Sala de Internación (día)", precio: 45000 },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ codigo: "", nombre: "", precio: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (editing) setForm({ codigo: editing.codigo, nombre: editing.nombre, precio: editing.precio }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ codigo: "", nombre: "", precio: 0 }); setModalOpen(true) }
  const openEdit = (p) => { setEditing(p); setModalOpen(true) }

  const save = async () => {
    if (!form.codigo || !form.nombre) { toast.error('Código y nombre requeridos'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    if (editing) {
      setPrestaciones(prestaciones.map(pr => pr.id === editing.id ? { ...pr, ...form } : pr))
      toast.success('Prestación actualizada (simulado)')
    } else {
      setPrestaciones([{ id: Date.now(), ...form }, ...prestaciones])
      toast.success('Prestación creada (simulado)')
    }
    setModalOpen(false)
    setLoading(false)
    setEditing(null)
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Código</th>
                <th className="px-6 py-3 text-xs text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-xs text-gray-500">Precio</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {prestaciones.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.codigo}</td>
                  <td className="px-6 py-4">{p.nombre}</td>
                  <td className="px-6 py-4">${p.precio.toLocaleString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(p)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar prestación' : 'Nueva prestación'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Código</label>
            <input value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
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