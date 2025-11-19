import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../services/apiClient'
import Modal from './Modal'

export default function EnfermerosContent() {
  const [enfermeros, setEnfermeros] = useState([])
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
    matricula: '',
    nombre_usuario: '',
    password: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [selectedEnfermero, setSelectedEnfermero] = useState(null)

  useEffect(() => {
    fetchEnfermeros()
  }, [])

  const fetchEnfermeros = async () => {
    try {
      const response = await apiClient.get('/admin/enfermeros')
      const data = response.data?.data ?? response.data ?? []
      setEnfermeros(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar enfermeros:', error)
      toast.error('Error al cargar enfermeros')
      setEnfermeros([])
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
        await apiClient.put(`/admin/enfermeros/${editingId}`, formData)
        toast.success('Enfermero actualizado')
      } else {
        await apiClient.post('/admin/enfermeros', formData)
        toast.success('Enfermero creado')
      }
      fetchEnfermeros()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error al guardar enfermero')
    }
  }

  const handleEdit = (enfermero) => {
    setFormData({
      nombre: enfermero.nombre,
      apellido: enfermero.apellido,
      dni: enfermero.dni,
      fecha_nacimiento: enfermero.fecha_nacimiento || '',
      genero: enfermero.genero || '',
      direccion: enfermero.direccion || '',
      telefono: enfermero.telefono || '',
      email: enfermero.email || '',
      matricula: enfermero.matricula || '',
      nombre_usuario: '',
      password: ''
    })
    setEditingId(enfermero.id_enfermero)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar enfermero?')) return
    try {
      await apiClient.delete(`/admin/enfermeros/${id}`)
      toast.success('Enfermero eliminado')
      fetchEnfermeros()
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
      matricula: '',
      nombre_usuario: '',
      password: ''
    })
    setEditingId(null)
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Enfermeros</h1>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Gestiona el personal de enfermería del hospital</p>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Enfermero'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Enfermero' : 'Crear Enfermero'}</h2>
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
            <input type="text" name="matricula" placeholder="Matrícula" value={formData.matricula} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
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
          <p className="text-center py-8 text-gray-500">Cargando enfermeros...</p>
        ) : enfermeros.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay enfermeros registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Nombre</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">DNI</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Matrícula</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Email</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Teléfono</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enfermeros.map(enfermero => (
                  <tr key={enfermero.id_enfermero} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{enfermero.nombre} {enfermero.apellido}</td>
                    <td className="px-6 py-4">{enfermero.dni}</td>
                    <td className="px-6 py-4">{enfermero.matricula || 'N/A'}</td>
                    <td className="px-6 py-4">{enfermero.email || 'N/A'}</td>
                    <td className="px-6 py-4">{enfermero.telefono || 'N/A'}</td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button onClick={() => {
                        setSelectedEnfermero(enfermero)
                        setShowForm(false)
                      }} className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">Ver</button>
                      <button onClick={() => handleEdit(enfermero)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">Editar</button>
                      <button onClick={() => handleDelete(enfermero.id_enfermero)} className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedEnfermero && <Modal title={`${selectedEnfermero.nombre} ${selectedEnfermero.apellido}`} onClose={() => setSelectedEnfermero(null)}>
        <div className="space-y-2">
          <p><strong>DNI:</strong> {selectedEnfermero.dni}</p>
          <p><strong>Matrícula:</strong> {selectedEnfermero.matricula || 'N/A'}</p>
          <p><strong>Email:</strong> {selectedEnfermero.email || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {selectedEnfermero.telefono || 'N/A'}</p>
        </div>
      </Modal>}
    </>
  )
}
