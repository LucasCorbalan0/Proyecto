import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function InfraestructuraContent() {
  const initialRooms = [
    { id: 101, tipo: "Habitación", camas: 2, ocupadas: 1 },
    { id: 201, tipo: "Quirófano", camas: 0, ocupadas: 0 },
  ]
  const [rooms, setRooms] = useState(initialRooms)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: "", tipo: "Habitación", camas: 1 })
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (editing) setForm({ id: editing.id, tipo: editing.tipo, camas: editing.camas }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ id: "", tipo: "Habitación", camas: 1 }); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setModalOpen(true) }

  const save = async () => {
    if (!form.id) { toast.error('Número requerido'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    if (editing) {
      setRooms(rooms.map(rm => rm.id === editing.id ? { ...rm, ...form, camas: Number(form.camas) } : rm))
      toast.success('Elemento actualizado (simulado)')
    } else {
      setRooms([{ id: form.id, tipo: form.tipo, camas: Number(form.camas), ocupadas: 0 }, ...rooms])
      toast.success('Elemento agregado (simulado)')
    }
    setLoading(false)
    setModalOpen(false)
    setEditing(null)
  }

  const occupy = (id) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ocupadas: Math.min(r.camas, r.ocupadas + 1) } : r))
    toast.success('Ocupación actualizada (simulado)')
  }

  const remove = (id) => {
    if (!confirm('Eliminar elemento de infraestructura?')) return
    setRooms(rooms.filter(r => r.id !== id))
    toast.success('Eliminado (simulado)')
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Infraestructura</h1>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">N°</th>
                <th className="px-6 py-3 text-xs text-gray-500">Tipo</th>
                <th className="px-6 py-3 text-xs text-gray-500">Camas</th>
                <th className="px-6 py-3 text-xs text-gray-500">Ocupadas</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rooms.map(r => (
                <tr key={r.id}>
                  <td className="px-6 py-4">{r.id}</td>
                  <td className="px-6 py-4">{r.tipo}</td>
                  <td className="px-6 py-4">{r.camas}</td>
                  <td className="px-6 py-4">{r.ocupadas}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(r)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => occupy(r.id)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">Ocupar</button>
                    <button onClick={() => remove(r.id)} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar elemento' : 'Nuevo elemento'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Número</label>
            <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Tipo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="w-full rounded-lg border p-2">
              <option>Habitación</option>
              <option>Quirófano</option>
              <option>UCI</option>
            </select>
            <label className="text-sm text-gray-500">Camas</label>
            <input type="number" value={form.camas} onChange={e => setForm({ ...form, camas: e.target.value })} className="w-full rounded-lg border p-2" />
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