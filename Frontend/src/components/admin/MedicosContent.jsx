import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../services/apiClient'
import Modal from './Modal'

export default function MedicosContent() {
  const [medicos, setMedicos] = useState([])
  const [especialidades, setEspecialidades] = useState([])
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
    id_especialidad: '',
    nombre_usuario: '',
    password: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [selectedMedico, setSelectedMedico] = useState(null)

  useEffect(() => {
    fetchMedicos()
    fetchEspecialidades()
  }, [])

  const fetchMedicos = async () => {
    try {
      const response = await apiClient.get('/admin/medicos')
      const data = response.data?.data ?? response.data ?? []
      setMedicos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar médicos:', error)
      toast.error('Error al cargar médicos')
      setMedicos([])
    } finally {
      setDataLoading(false)
    }
  }

  const fetchEspecialidades = async () => {
    try {
      const response = await apiClient.get('/admin/especialidades')
      const data = response.data?.data ?? response.data ?? []
      setEspecialidades(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar especialidades:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.matricula || !formData.id_especialidad || !formData.nombre_usuario || !formData.password) {
      toast.error('Complete todos los campos requeridos')
      return
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/medicos/${editingId}`, formData)
        toast.success('Médico actualizado')
      } else {
        await apiClient.post('/admin/medicos', formData)
        toast.success('Médico creado')
      }
      fetchMedicos()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error al guardar médico')
    }
  }

  const handleEdit = (medico) => {
    setFormData({
      nombre: medico.nombre,
      apellido: medico.apellido,
      dni: medico.dni,
      fecha_nacimiento: medico.fecha_nacimiento || '',
      genero: medico.genero || '',
      direccion: medico.direccion || '',
      telefono: medico.telefono || '',
      email: medico.email || '',
      matricula: medico.matricula,
      id_especialidad: especialidades.find(e => e.nombre === medico.especialidad)?.id_especialidad || '',
      nombre_usuario: '',
      password: ''
    })
    setEditingId(medico.id_medico)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar médico?')) return
    try {
      await apiClient.delete(`/admin/medicos/${id}`)
      toast.success('Médico eliminado')
      fetchMedicos()
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
      id_especialidad: '',
      nombre_usuario: '',
      password: ''
    })
    setEditingId(null)
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Médicos</h1>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Gestiona el personal médico del hospital</p>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Médico'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Médico' : 'Crear Médico'}</h2>
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
            <input type="text" name="matricula" placeholder="Matrícula" value={formData.matricula} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <select name="id_especialidad" value={formData.id_especialidad} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required>
              <option value="">Selecciona Especialidad</option>
              {especialidades.map(e => (
                <option key={e.id_especialidad} value={e.id_especialidad}>{e.nombre}</option>
              ))}
            </select>
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
          <p className="text-center py-8 text-gray-500">Cargando médicos...</p>
        ) : medicos.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay médicos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Nombre</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">DNI</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Matrícula</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Especialidad</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Teléfono</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {medicos.map(medico => (
                  <tr key={medico.id_medico} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{medico.nombre} {medico.apellido}</td>
                    <td className="px-6 py-4">{medico.dni}</td>
                    <td className="px-6 py-4">{medico.matricula}</td>
                    <td className="px-6 py-4">{medico.especialidad}</td>
                    <td className="px-6 py-4">{medico.telefono || 'N/A'}</td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button onClick={() => {
                        setSelectedMedico(medico)
                        setShowForm(false)
                      }} className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">Ver</button>
                      <button onClick={() => handleEdit(medico)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">Editar</button>
                      <button onClick={() => handleDelete(medico.id_medico)} className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedMedico && <Modal title={`${selectedMedico.nombre} ${selectedMedico.apellido}`} onClose={() => setSelectedMedico(null)}>
        <div className="space-y-2">
          <p><strong>DNI:</strong> {selectedMedico.dni}</p>
          <p><strong>Matrícula:</strong> {selectedMedico.matricula}</p>
          <p><strong>Especialidad:</strong> {selectedMedico.especialidad}</p>
          <p><strong>Email:</strong> {selectedMedico.email || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {selectedMedico.telefono || 'N/A'}</p>
        </div>
      </Modal>}
    </>
  )
}
