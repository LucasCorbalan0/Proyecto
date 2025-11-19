import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../services/apiClient'
import Modal from './Modal'

export default function PacientesContent() {
  const [pacientes, setPacientes] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fecha_nacimiento: '',
    genero: '',
    telefono: '',
    email: '',
    direccion: '',
    nombre_usuario: '',
    password: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [selectedPaciente, setSelectedPaciente] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    try {
      const response = await apiClient.get('/admin/pacientes')
      const data = response.data?.data ?? response.data ?? []
      setPacientes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar pacientes:', error)
      toast.error('Error al cargar pacientes')
      setPacientes([])
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
      toast.error('Complete los campos requeridos (nombre, apellido, dni, usuario, contraseña)')
      return
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/pacientes/${editingId}`, formData)
        toast.success('Paciente actualizado')
      } else {
        await apiClient.post('/admin/pacientes', formData)
        toast.success('Paciente creado')
      }
      fetchPacientes()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error al guardar paciente')
    }
  }

  const handleEdit = (paciente) => {
    setFormData({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      dni: paciente.dni,
      fecha_nacimiento: paciente.fecha_nacimiento || '',
      genero: paciente.genero || '',
      telefono: paciente.telefono || '',
      email: paciente.email || '',
      direccion: paciente.direccion || '',
      nombre_usuario: '',
      password: ''
    })
    setEditingId(paciente.id_paciente)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar paciente?')) return
    try {
      await apiClient.delete(`/admin/pacientes/${id}`)
      toast.success('Paciente eliminado')
      fetchPacientes()
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
      telefono: '',
      email: '',
      direccion: '',
      nombre_usuario: '',
      password: ''
    })
    setEditingId(null)
  }

  const filteredPacientes = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm)
  )

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pacientes</h1>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Gestiona el registro de pacientes</p>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Paciente'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Paciente' : 'Crear Paciente'}</h2>
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
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} className="px-4 py-2 border rounded-lg md:col-span-2" />
            <input type="text" name="nombre_usuario" placeholder="Usuario (para login)" value={formData.nombre_usuario} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required disabled={editingId} />
            <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required disabled={editingId} />
            <button type="submit" className="col-span-1 md:col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {dataLoading ? (
          <p className="text-center py-8 text-gray-500">Cargando pacientes...</p>
        ) : filteredPacientes.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay pacientes registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Nombre</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">DNI</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Email</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Teléfono</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Fecha Nac.</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPacientes.map(paciente => (
                  <tr key={paciente.id_paciente} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{paciente.nombre} {paciente.apellido}</td>
                    <td className="px-6 py-4">{paciente.dni}</td>
                    <td className="px-6 py-4 text-sm">{paciente.email || 'N/A'}</td>
                    <td className="px-6 py-4">{paciente.telefono || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{paciente.fecha_nacimiento || 'N/A'}</td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button onClick={() => setSelectedPaciente(paciente)} className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">Ver</button>
                      <button onClick={() => handleEdit(paciente)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">Editar</button>
                      <button onClick={() => handleDelete(paciente.id_paciente)} className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPaciente && <Modal title={`${selectedPaciente.nombre} ${selectedPaciente.apellido}`} onClose={() => setSelectedPaciente(null)}>
        <div className="space-y-2">
          <p><strong>DNI:</strong> {selectedPaciente.dni}</p>
          <p><strong>Género:</strong> {selectedPaciente.genero || 'N/A'}</p>
          <p><strong>Fecha Nacimiento:</strong> {selectedPaciente.fecha_nacimiento || 'N/A'}</p>
          <p><strong>Email:</strong> {selectedPaciente.email || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {selectedPaciente.telefono || 'N/A'}</p>
          <p><strong>Dirección:</strong> {selectedPaciente.direccion || 'N/A'}</p>
        </div>
      </Modal>}
    </>
  )
}
