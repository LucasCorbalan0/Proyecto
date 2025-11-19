import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../services/apiClient'
import Modal from './Modal'

export default function RecepcionistasContent() {
  const [recepcionistas, setRecepcionistas] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fecha_nacimiento: '',
    genero: '',
    direccion: '',
    telefono: '',
    email: '',
    nombre_usuario: '',
    password: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [selectedRecepcionista, setSelectedRecepcionista] = useState(null)

  useEffect(() => {
    fetchRecepcionistas()
  }, [])

  const fetchRecepcionistas = async () => {
    try {
      const response = await apiClient.get('/admin/recepcionistas')
      const data = response.data?.data ?? response.data ?? []
      setRecepcionistas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar recepcionistas:', error)
      toast.error('Error al cargar recepcionistas')
      setRecepcionistas([])
    } finally {
      setDataLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.nombre_usuario || !formData.password) {
      toast.error('Complete todos los campos requeridos')
      return
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/recepcionistas/${editingId}`, formData)
        toast.success('Recepcionista actualizado')
      } else {
        await apiClient.post('/admin/recepcionistas', formData)
        toast.success('Recepcionista creado')
      }
      fetchRecepcionistas()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error al guardar recepcionista')
    }
  }

  const handleEdit = (recepcionista) => {
    setFormData({
      nombre: recepcionista.nombre,
      apellido: recepcionista.apellido,
      dni: recepcionista.dni,
      fecha_nacimiento: recepcionista.fecha_nacimiento || '',
      genero: recepcionista.genero || '',
      direccion: recepcionista.direccion || '',
      telefono: recepcionista.telefono || '',
      email: recepcionista.email || '',
      nombre_usuario: '',
      password: ''
    })
    setEditingId(recepcionista.id_recepcionista)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar recepcionista?')) return
    try {
      await apiClient.delete(`/admin/recepcionistas/${id}`)
      toast.success('Recepcionista eliminado')
      fetchRecepcionistas()
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      fecha_nacimiento: '',
      genero: '',
      direccion: '',
      telefono: '',
      email: '',
      nombre_usuario: '',
      password: ''
    })
    setEditingId(null)
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Recepcionistas</h1>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Gestiona el personal de recepción del hospital</p>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Recepcionista'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Recepcionista' : 'Crear Recepcionista'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required />
            <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required />
            <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required />
            <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <select name="genero" value={formData.genero} onChange={handleInputChange} className="px-4 py-2 border rounded-lg">
              <option value="">Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input type="text" name="nombre_usuario" placeholder="Usuario (para login)" value={formData.nombre_usuario} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required disabled={editingId} />
            <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required disabled={editingId} />
            <button type="submit" className="col-span-1 md:col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        {dataLoading ? (
          <p className="text-center py-8 text-gray-500">Cargando recepcionistas...</p>
        ) : recepcionistas.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay recepcionistas registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Nombre</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">DNI</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Email</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Teléfono</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recepcionistas.map(recepcionista => (
                  <tr key={recepcionista.id_recepcionista} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{recepcionista.nombre} {recepcionista.apellido}</td>
                    <td className="px-6 py-4">{recepcionista.dni}</td>
                    <td className="px-6 py-4">{recepcionista.email || 'N/A'}</td>
                    <td className="px-6 py-4">{recepcionista.telefono || 'N/A'}</td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button onClick={() => {
                        setSelectedRecepcionista(recepcionista)
                        setShowForm(false)
                      }} className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">Ver</button>
                      <button onClick={() => handleEdit(recepcionista)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">Editar</button>
                      <button onClick={() => handleDelete(recepcionista.id_recepcionista)} className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRecepcionista && <Modal title={`${selectedRecepcionista.nombre} ${selectedRecepcionista.apellido}`} onClose={() => setSelectedRecepcionista(null)}>
        <div className="space-y-2">
          <p><strong>DNI:</strong> {selectedRecepcionista.dni}</p>
          <p><strong>Email:</strong> {selectedRecepcionista.email || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {selectedRecepcionista.telefono || 'N/A'}</p>
        </div>
      </Modal>}
    </>
  )
}
