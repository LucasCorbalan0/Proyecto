// src/components/admin/InfraestructuraContent.jsx
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './Modal'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { 
  getInfraestructura, 
  createInfraestructura, 
  updateInfraestructura, 
  deleteInfraestructura, 
  occupyCama 
} from '@/services/infraestructura.service.js' // <--- RUTA CORREGIDA CON ALIAS

export default function InfraestructuraContent() {
  const [rooms, setRooms] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: "", tipo: "Simple", camas: 1 }) 
  const [loading, setLoading] = useState(false)

  // Función para cargar los datos desde el backend
  const loadRooms = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getInfraestructura()
      
      console.log("Datos recibidos de la API:", response.data); // DEBUGGING

      if (Array.isArray(response.data)) {
        // Mapeo defensivo para asegurar que los números sean correctos
        const formattedRooms = response.data.map(r => ({
          ...r,
          camas: Number(r.camas) || 0,
          ocupadas: Number(r.ocupadas) || 0,
        }));
        setRooms(formattedRooms);
      } else {
        console.error("La API no devolvió un array. Tipo de dato:", typeof response.data);
        setRooms([]);
      }
      
    } catch (error) {
      console.error("Error al cargar infraestructura:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Error al cargar infraestructura')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  useEffect(() => { 
    if (editing) {
        setForm({ 
            id: editing.id_display, 
            tipo: editing.tipo, 
            camas: editing.camas 
        }) 
    }
  }, [editing])

  const openCreate = () => { setEditing(null); setForm({ id: "", tipo: "Simple", camas: 1 }); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setModalOpen(true) } 

  // Guardar/Actualizar
  const save = async () => {
    if (!form.id) { toast.error('Número/Nombre de unidad requerido'); return }
    
    const payload = {
        id: form.id, 
        tipo: form.tipo,
        camas: Number(form.camas),
    };

    setLoading(true)
    try {
        if (editing) {
            await updateInfraestructura(editing.id, payload) 
            toast.success('Elemento actualizado exitosamente')
        } else {
            await createInfraestructura(payload)
            toast.success('Elemento agregado exitosamente')
        }
        
        loadRooms() 
        setModalOpen(false)
        setEditing(null)
    } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Error al guardar la infraestructura')
    } finally {
        setLoading(false)
    }
  }

  // Ocupar cama
  const occupy = async (id_habitacion_bd) => { 
    if (!confirm('¿Marcar como ocupada la próxima cama disponible en esta unidad?')) return
    setLoading(true)
    try {
      await occupyCama(id_habitacion_bd) 
      toast.success("Cama ocupada. Recargando lista...")
      loadRooms()
    } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Error al ocupar la cama.')
    } finally {
      setLoading(false)
    }
  }

  // Eliminar elemento
  const remove = async (id_habitacion_bd) => { 
    if (!confirm('¿Eliminar elemento de infraestructura? Esto eliminará también todas las camas asociadas.')) return
    setLoading(true)
    try {
      await deleteInfraestructura(id_habitacion_bd)
      toast.success("Elemento eliminado exitosamente")
      loadRooms()
    } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Error al eliminar el elemento.')
    } finally {
      setLoading(false)
    }
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
          {loading && <p className="p-4 text-center text-blue-600">Cargando datos...</p>}
          {!loading && rooms.length === 0 && <p className="p-4 text-sm text-gray-500">No hay elementos de infraestructura registrados.</p>}
          {!loading && rooms.length > 0 && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-left text-gray-500">N°</th>
                  <th className="px-6 py-3 text-xs text-left text-gray-500">Tipo</th>
                  <th className="px-6 py-3 text-xs text-left text-gray-500">Camas Totales</th>
                  <th className="px-6 py-3 text-xs text-left text-gray-500">Ocupadas</th>
                  <th className="px-6 py-3 text-xs text-left text-gray-500">Disponibles</th>
                  <th className="px-6 py-3 text-xs text-left text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rooms.map(r => (
                  <tr key={r.id}>
                    <td className="px-6 py-4">{r.id_display}</td> 
                    <td className="px-6 py-4">{r.tipo}</td>
                    <td className="px-6 py-4">{r.camas}</td>
                    <td className="px-6 py-4">{r.ocupadas}</td>
                    <td className="px-6 py-4 font-semibold text-green-700">{r.camas - r.ocupadas}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEdit(r)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                      <button 
                        onClick={() => occupy(r.id)} 
                        disabled={r.ocupadas >= r.camas || r.camas === 0}
                        className={`px-2 py-1 rounded text-sm ${r.ocupadas >= r.camas || r.camas === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                      >
                        Ocupar
                      </button>
                      <button onClick={() => remove(r.id)} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => { if (!loading) { setModalOpen(false); setEditing(null); setForm({ id: "", tipo: "Simple", camas: 1 }); } }}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar elemento' : 'Nuevo elemento'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Número/Nombre (Ej: 101, Quirofano C)</label>
            <input 
              value={form.id} 
              onChange={e => setForm({ ...form, id: e.target.value })} 
              className="w-full rounded-lg border p-2" 
              disabled={editing} 
            />
            <label className="text-sm text-gray-500">Tipo</label>
            <select 
              value={form.tipo} 
              onChange={e => setForm({ ...form, tipo: e.target.value })} 
              className="w-full rounded-lg border p-2"
            >
              <option value="Simple">Habitación Simple</option>
              <option value="Doble">Habitación Doble</option>
              <option value="UCI">UCI</option>
              <option value="Quirófano">Quirófano</option>
            </select>
            <label className="text-sm text-gray-500">Camas (0 si no aplica)</label>
            <input 
              type="number" 
              value={form.camas} 
              onChange={e => setForm({ ...form, camas: e.target.value })} 
              className="w-full rounded-lg border p-2" 
              min={0}
            />
            <div className="flex gap-2 mt-2">
              <button onClick={save} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Guardando...' : 'Guardar'}</button>
              <button onClick={() => { if (!loading) { setModalOpen(false); setEditing(null); setForm({ id: "", tipo: "Simple", camas: 1 }); } }} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}