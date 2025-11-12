// Archivo: src/components/admin/UsuariosContent.jsx
import { useEffect, useState, useCallback } from 'react' // <--- Se añadió useCallback
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus, Edit, UserCheck, Trash2, Save } from 'lucide-react'
import { 
    getUsers, 
    createUser, 
    updateUser, 
    toggleActiveUser, 
    deleteUser 
} from '../../services/admin.service' // <--- Importación del nu

export default function UsuariosContent() {
  // Eliminamos initialUsers
  const [users, setUsers] = useState([]) 
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true) // Estado para carga inicial
  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico", genero: "", direccion: "" })

  // Función para cargar los usuarios
  const loadUsers = useCallback(async () => {
    setDataLoading(true)
    try {
      const response = await getUsers();
      // El backend puede devolver { success, total, data } o directamente un array.
      const raw = response.data?.data ?? response.data ?? response;
      // Normalizar cada usuario a la forma que espera este componente
      const normalized = (Array.isArray(raw) ? raw : []).map(u => ({
        id: u.id_usuario ?? u.id ?? u.id_usuario,
        nombre_persona: u.nombre ?? u.nombre_persona ?? '',
        apellido_persona: u.apellido ?? u.apellido_persona ?? '',
        nombre: (u.nombre && u.apellido) ? `${u.nombre} ${u.apellido}` : (u.nombre ?? u.nombre_persona ?? ''),
        dni: u.dni ?? u.documento ?? '',
        email: u.email ?? '',
        fechaNacimiento: u.fecha_nacimiento ?? u.fechaNacimiento ?? null,
        telefono: u.telefono ?? '',
        username: u.nombre_usuario ?? u.username ?? '',
        genero: u.genero ?? u.sexo ?? '',
        direccion: u.direccion ?? '',
        rol: u.rol ?? u.nombre_rol ?? u.rol_sistema ?? 'Usuario',
        activo: (u.activo === 1 || u.activo === true)
      }));

      setUsers(normalized);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error('Error al cargar la lista de usuarios. Verifica la conexión al backend y la autenticación.')
      setUsers([]);
    } finally {
      setDataLoading(false)
    }
  }, [])

  // Carga inicial al montar el componente
  useEffect(() => {
    loadUsers()
  }, [loadUsers])


  // Lógica para poblar el formulario al editar
  useEffect(() => {
    if (editing) {
      setForm({
        // El backend devuelve los campos separados (nombre_persona, apellido_persona)
        nombre: editing.nombre_persona || "", 
        apellido: editing.apellido_persona || "", 
        dni: editing.dni || "",
        email: editing.email,
        fechaNacimiento: editing.fechaNacimiento || "", // YYYY-MM-DD
        telefono: editing.telefono || "",
        username: editing.username || "",
        genero: editing.genero || "",
        direccion: editing.direccion || "",
        rol: editing.rol 
      })
    }
  }, [editing])

  const openCreate = () => { setEditing(null); setForm({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico", genero: "", direccion: "" }); setModalOpen(true) }
  
  // Modificamos openEdit para que tome los campos individuales que devuelve la API
  const openEdit = (u) => { 
    setEditing(u); 
    setModalOpen(true); 
  }

  // --- IMPLEMENTACIÓN REAL: CREAR/ACTUALIZAR ---
  const save = async () => {
    if (!form.nombre || !form.apellido || !form.dni || !form.email || !form.username || !form.rol) { 
        toast.error("Completar todos los campos requeridos"); 
        return 
    }
    
    // Si es creación, la contraseña será el DNI
    if (!editing && !form.password) {
        form.password = form.dni;
    }
    
    setLoading(true)
    
    const dataToSend = {
      nombre: form.nombre,
      apellido: form.apellido,
      dni: form.dni,
      email: form.email,
      fechaNacimiento: form.fechaNacimiento,
      telefono: form.telefono,
      username: form.username,
      rol: form.rol,
      genero: form.genero,
      direccion: form.direccion,
      // Para creación: enviar DNI como contraseña
      password: form.password || form.dni
    }

    try {
        if (editing) {
          await updateUser(editing.id, dataToSend); 
          toast.success("Usuario modificado exitosamente.");
        } else {
          await createUser(dataToSend);
          toast.success("Usuario creado exitosamente. La contraseña es su DNI.");
        }
        
        setModalOpen(false)
        setEditing(null)
        setForm({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico", genero: "", direccion: "" })
        loadUsers() // Recargar para mostrar los cambios
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Ocurrió un error al guardar el usuario.";
        toast.error(errorMessage);
        console.error("Error al guardar usuario:", error);
    } finally {
        setLoading(false)
    }
  }


  // --- IMPLEMENTACIÓN REAL: TOGGLE ACTIVO ---
  const toggleActive = async (id) => {
    try {
        const response = await toggleActiveUser(id);
        const resData = response.data ?? {};
        // El backend puede devolver 'nuevoEstado' (boolean) o 'newStatus' o incluso la propia respuesta booleana
        const newStatus = (typeof resData === 'boolean') ? resData : (resData.nuevoEstado ?? resData.newStatus ?? null);

        if (typeof newStatus === 'boolean') {
          setUsers(users.map(u => u.id === id ? { ...u, activo: newStatus } : u))
          toast.success(`Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente.`)
        } else {
          // Fallback: recargar la lista completa
          loadUsers();
          toast.success('Estado del usuario actualizado.');
        }
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al cambiar el estado.";
        toast.error(errorMessage);
        console.error("Error al hacer toggle:", error);
    }
  }

  // --- IMPLEMENTACIÓN REAL: ELIMINAR ---
  const remove = async (id) => {
    if (!confirm("ADVERTENCIA: ¿Está seguro de eliminar este usuario? Esta acción es irreversible y eliminará todos sus datos personales.")) return
    
    try {
        await deleteUser(id);
        
        // Actualizamos la interfaz
        setUsers(users.filter(u => u.id !== id))
        toast.success("Usuario eliminado exitosamente.")
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al eliminar el usuario.";
        toast.error(errorMessage);
        console.error("Error al eliminar:", error);
    }
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
        {dataLoading ? (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500">Cargando usuarios desde la base de datos...</p>
            </div>
        ) : (
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
          {users.length === 0 && !dataLoading && <p className="p-4 text-sm text-gray-500">No hay usuarios.</p>}
        </div>
        )}
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
                <option>Paciente</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500">Sexo / Género</label>
              <select value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} className="w-full rounded-lg border p-2">
                <option value="">-- Seleccionar --</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-500">Dirección</label>
              <input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} className="w-full rounded-lg border p-2" placeholder="Calle, número, ciudad..." />
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