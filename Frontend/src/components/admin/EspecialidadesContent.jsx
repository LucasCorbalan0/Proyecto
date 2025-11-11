import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus, Edit } from 'lucide-react'

export default function EspecialidadesContent() {
  const [esp, setEsp] = useState([
    { id: 1, nombre: "Cardiología", es_quirurgica: false },
    { id: 2, nombre: "Cirugía General", es_quirurgica: true },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", es_quirurgica: false })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (editing) setForm({ nombre: editing.nombre, es_quirurgica: editing.es_quirurgica }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ nombre: "", es_quirurgica: false }); setModalOpen(true) }
  const openEdit = (e) => { setEditing(e); setModalOpen(true) }

  const save = async () => {
    if (!form.nombre) { toast.error('Nombre requerido'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    if (editing) {
      setEsp(esp.map(x => x.id === editing.id ? { ...x, ...form } : x))
      toast.success('Especialidad actualizada (simulado)')
    } else {
      setEsp([{ id: Date.now(), ...form }, ...esp])
      toast.success('Especialidad agregada (simulado)')
    }
    setModalOpen(false)
    setEditing(null)
    setLoading(false)
  }

  const toggleSurgical = (id) => { setEsp(esp.map(e => e.id === id ? { ...e, es_quirurgica: !e.es_quirurgica } : e)); toast.success('Actualizado (simulado)') }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Especialidades</h1>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-xs text-gray-500">Es Quirúrgica</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {esp.map(e => (
                <tr key={e.id}>
                  <td className="px-6 py-4">{e.nombre}</td>
                  <td className="px-6 py-4">{e.es_quirurgica ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(e)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => toggleSurgical(e.id)} className={`px-2 py-1 rounded text-sm ${e.es_quirurgica ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{e.es_quirurgica ? 'Quitar quirúrgica' : 'Marcar quirúrgica'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar especialidad' : 'Nueva especialidad'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.es_quirurgica} onChange={e => setForm({ ...form, es_quirurgica: e.target.checked })} /> Marcar como quirúrgica</label>
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