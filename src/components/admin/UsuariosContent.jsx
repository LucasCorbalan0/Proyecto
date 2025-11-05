import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus, Edit, UserCheck, Trash2, Save } from 'lucide-react'

export default function UsuariosContent() {
  const initialUsers = [
    { id: 1, nombre: "Dr. Juan Pérez", rol: "Médico", activo: true, email: "juan.perez@hospital.local" },
    { id: 2, nombre: "Enf. Marta López", rol: "Enfermero", activo: true, email: "marta.lopez@hospital.local" },
    { id: 3, nombre: "Carlos Ramos", rol: "Recepcionista", activo: false, email: "carlos.ramos@hospital.local" },
  ]
  const [users, setUsers] = useState(initialUsers)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico" })

  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre.split(' ')[1] || "",
        apellido: editing.nombre.split(' ')[0] || "",
        dni: editing.dni || "",
        email: editing.email,
        fechaNacimiento: editing.fechaNacimiento || "",
        telefono: editing.telefono || "",
        username: editing.username || "",
        rol: editing.rol
      })
    }
  }, [editing])

  const openCreate = () => { setEditing(null); setForm({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico" }); setModalOpen(true) }
  const openEdit = (u) => { setEditing(u); setModalOpen(true) }

  const save = async () => {
    if (!form.nombre || !form.apellido || !form.dni || !form.email || !form.username) { toast.error("Completar todos los campos requeridos"); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    if (editing) {
      setUsers(users.map(u => u.id === editing.id ? { ...u, nombre: `${form.apellido} ${form.nombre}`, ...form } : u))
      toast.success("Usuario modificado (simulado)")
    } else {
      const nuevo = { id: Date.now(), ...form, nombre: `${form.apellido} ${form.nombre}`, activo: true, password: form.dni }
      setUsers([nuevo, ...users])
      toast.success("Usuario creado (simulado)")
    }
    setModalOpen(false)
    setEditing(null)
    setForm({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico" })
    setLoading(false)
  }

  const toggleActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, activo: !u.activo } : u))
    toast.success("Estado actualizado (simulado)")
  }

  const remove = (id) => {
    if (!confirm("¿Eliminar usuario?")) return
    setUsers(users.filter(u => u.id !== id))
    toast.success("Usuario eliminado (simulado)")
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <div className="flex gap-2">
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Rol</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Estado</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{u.nombre}</td>
                  <td className="px-6 py-4">{u.rol}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{u.activo ? 'Activo' : 'Desactivado'}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(u)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm flex items-center gap-1"><Edit className="w-4 h-4" />Editar</button>
                    <button onClick={() => toggleActive(u.id)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm flex items-center gap-1"><UserCheck className="w-4 h-4" />{u.activo ? 'Desactivar' : 'Activar'}</button>
                    <button onClick={() => remove(u.id)} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm flex items-center gap-1"><Trash2 className="w-4 h-4" />Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="p-4 text-sm text-gray-500">No hay usuarios.</p>}
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => { if (!loading) setModalOpen(false); }}>
          <h3 className="text-xl font-semibold mb-4">{editing ? 'Editar Usuario' : 'Crear Usuario'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Nombre</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Apellido</label>
              <input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">DNI</label>
              <input value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Fecha de Nacimiento</label>
              <input type="date" value={form.fechaNacimiento} onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Teléfono</label>
              <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Nombre de Usuario</label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Rol</label>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} className="w-full rounded-lg border p-2">
                <option>Médico</option>
                <option>Enfermero</option>
                <option>Recepcionista</option>
                <option>Administrativo</option>
              </select>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">La contraseña será el DNI.</p>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={save} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
              {loading ? 'Guardando...' : (<><Save className="w-4 h-4" /> Guardar</>)}
            </button>
            <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
          </div>
        </Modal>
      )}
    </>
  )
}