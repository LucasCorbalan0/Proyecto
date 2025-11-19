import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../services/apiClient'
import Modal from './Modal'

export default function InfraestructuraContent() {
  const [activeTab, setActiveTab] = useState('habitaciones')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Infraestructura Hospitalaria</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('habitaciones')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'habitaciones'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Habitaciones
        </button>
        <button
          onClick={() => setActiveTab('camas')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'camas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Camas
        </button>
        <button
          onClick={() => setActiveTab('quirofanos')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'quirofanos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Quirófanos
        </button>
      </div>

      {activeTab === 'habitaciones' && <HabitacionesTab />}
      {activeTab === 'camas' && <CamasTab />}
      {activeTab === 'quirofanos' && <QuirofanosTab />}
    </div>
  )
}

function HabitacionesTab() {
  const [habitaciones, setHabitaciones] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    numero_habitacion: '',
    tipo_habitacion: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [selectedHabitacion, setSelectedHabitacion] = useState(null)

  useEffect(() => {
    fetchHabitaciones()
  }, [])

  const fetchHabitaciones = async () => {
    try {
      const response = await apiClient.get('/admin/habitaciones')
      const data = response.data?.data ?? response.data ?? []
      setHabitaciones(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar habitaciones:', error)
      toast.error('Error al cargar habitaciones')
      setHabitaciones([])
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

    if (!formData.numero_habitacion || !formData.tipo_habitacion) {
      toast.error('Complete todos los campos requeridos')
      return
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/habitaciones/${editingId}`, formData)
        toast.success('Habitación actualizada')
      } else {
        await apiClient.post('/admin/habitaciones', formData)
        toast.success('Habitación creada')
      }
      fetchHabitaciones()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error al guardar habitación')
    }
  }

  const handleEdit = (habitacion) => {
    setFormData({
      numero_habitacion: habitacion.numero_habitacion,
      tipo_habitacion: habitacion.tipo_habitacion
    })
    setEditingId(habitacion.id_habitacion)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar habitación?')) return
    try {
      await apiClient.delete(`/admin/habitaciones/${id}`)
      toast.success('Habitación eliminada')
      fetchHabitaciones()
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      numero_habitacion: '',
      tipo_habitacion: ''
    })
    setEditingId(null)
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Gestiona las habitaciones del hospital</p>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nueva Habitación'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Habitación' : 'Crear Habitación'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="numero_habitacion" placeholder="Número de Habitación" value={formData.numero_habitacion} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required />
            <select name="tipo_habitacion" value={formData.tipo_habitacion} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required>
              <option value="">Selecciona Tipo</option>
              <option value="Simple">Simple</option>
              <option value="Doble">Doble</option>
              <option value="UCI">UCI</option>
            </select>
            <button type="submit" className="col-span-1 md:col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        {dataLoading ? (
          <p className="text-center py-8 text-gray-500">Cargando habitaciones...</p>
        ) : habitaciones.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay habitaciones registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Número</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Tipo</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {habitaciones.map(habitacion => (
                  <tr key={habitacion.id_habitacion} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{habitacion.numero_habitacion}</td>
                    <td className="px-6 py-4">{habitacion.tipo_habitacion}</td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button onClick={() => setSelectedHabitacion(habitacion)} className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">Ver</button>
                      <button onClick={() => handleEdit(habitacion)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">Editar</button>
                      <button onClick={() => handleDelete(habitacion.id_habitacion)} className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedHabitacion && <Modal title={`Habitación ${selectedHabitacion.numero_habitacion}`} onClose={() => setSelectedHabitacion(null)}>
        <div className="space-y-2">
          <p><strong>Número:</strong> {selectedHabitacion.numero_habitacion}</p>
          <p><strong>Tipo:</strong> {selectedHabitacion.tipo_habitacion}</p>
        </div>
      </Modal>}
    </>
  )
}

function CamasTab() {
  const [camas, setCamas] = useState([])
  const [habitaciones, setHabitaciones] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id_habitacion: '',
    numero_cama: '',
    estado: 'Disponible'
  })
  const [editingId, setEditingId] = useState(null)
  const [selectedCama, setSelectedCama] = useState(null)

  useEffect(() => {
    fetchCamas()
    fetchHabitaciones()
  }, [])

  const fetchCamas = async () => {
    try {
      const response = await apiClient.get('/admin/camas')
      const data = response.data?.data ?? response.data ?? []
      setCamas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar camas:', error)
      toast.error('Error al cargar camas')
      setCamas([])
    } finally {
      setDataLoading(false)
    }
  }

  const fetchHabitaciones = async () => {
    try {
      const response = await apiClient.get('/admin/habitaciones')
      const data = response.data?.data ?? response.data ?? []
      setHabitaciones(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar habitaciones:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.id_habitacion || !formData.numero_cama) {
      toast.error('Complete todos los campos requeridos')
      return
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/camas/${editingId}`, formData)
        toast.success('Cama actualizada')
      } else {
        await apiClient.post('/admin/camas', formData)
        toast.success('Cama creada')
      }
      fetchCamas()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error al guardar cama')
    }
  }

  const handleEdit = (cama) => {
    setFormData({
      id_habitacion: cama.id_habitacion,
      numero_cama: cama.numero_cama,
      estado: cama.estado
    })
    setEditingId(cama.id_cama)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar cama?')) return
    try {
      await apiClient.delete(`/admin/camas/${id}`)
      toast.success('Cama eliminada')
      fetchCamas()
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      id_habitacion: '',
      numero_cama: '',
      estado: 'Disponible'
    })
    setEditingId(null)
  }

  const getHabitacionNumero = (id) => {
    const hab = habitaciones.find(h => h.id_habitacion === id)
    return hab ? hab.numero_habitacion : 'N/A'
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Gestiona las camas de las habitaciones</p>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nueva Cama'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Cama' : 'Crear Cama'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="id_habitacion" value={formData.id_habitacion} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required>
              <option value="">Selecciona Habitación</option>
              {habitaciones.map(hab => (
                <option key={hab.id_habitacion} value={hab.id_habitacion}>
                  {hab.numero_habitacion} ({hab.tipo_habitacion})
                </option>
              ))}
            </select>
            <input type="text" name="numero_cama" placeholder="Número de Cama (ej: A, B)" value={formData.numero_cama} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required />
            <select name="estado" value={formData.estado} onChange={handleInputChange} className="px-4 py-2 border rounded-lg">
              <option value="Disponible">Disponible</option>
              <option value="Ocupada">Ocupada</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
              <option value="Limpieza">Limpieza</option>
            </select>
            <button type="submit" className="col-span-1 md:col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        {dataLoading ? (
          <p className="text-center py-8 text-gray-500">Cargando camas...</p>
        ) : camas.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay camas registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Habitación</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Cama</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Estado</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {camas.map(cama => (
                  <tr key={cama.id_cama} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{getHabitacionNumero(cama.id_habitacion)}</td>
                    <td className="px-6 py-4">{cama.numero_cama}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        cama.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                        cama.estado === 'Ocupada' ? 'bg-red-100 text-red-800' :
                        cama.estado === 'Limpieza' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cama.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button onClick={() => setSelectedCama(cama)} className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">Ver</button>
                      <button onClick={() => handleEdit(cama)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">Editar</button>
                      <button onClick={() => handleDelete(cama.id_cama)} className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCama && <Modal title={`Cama ${selectedCama.numero_cama}`} onClose={() => setSelectedCama(null)}>
        <div className="space-y-2">
          <p><strong>Habitación:</strong> {getHabitacionNumero(selectedCama.id_habitacion)}</p>
          <p><strong>Cama:</strong> {selectedCama.numero_cama}</p>
          <p><strong>Estado:</strong> {selectedCama.estado}</p>
        </div>
      </Modal>}
    </>
  )
}

function QuirofanosTab() {
  const [quirofanos, setQuirofanos] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    estado: 'Disponible'
  })
  const [editingId, setEditingId] = useState(null)
  const [selectedQuirofano, setSelectedQuirofano] = useState(null)

  useEffect(() => {
    fetchQuirofanos()
  }, [])

  const fetchQuirofanos = async () => {
    try {
      const response = await apiClient.get('/admin/quirofanos')
      const data = response.data?.data ?? response.data ?? []
      setQuirofanos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar quirófanos:', error)
      toast.error('Error al cargar quirófanos')
      setQuirofanos([])
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

    if (!formData.nombre) {
      toast.error('Complete todos los campos requeridos')
      return
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/quirofanos/${editingId}`, formData)
        toast.success('Quirófano actualizado')
      } else {
        await apiClient.post('/admin/quirofanos', formData)
        toast.success('Quirófano creado')
      }
      fetchQuirofanos()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error al guardar quirófano')
    }
  }

  const handleEdit = (quirofano) => {
    setFormData({
      nombre: quirofano.nombre,
      estado: quirofano.estado
    })
    setEditingId(quirofano.id_quirofano)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar quirófano?')) return
    try {
      await apiClient.delete(`/admin/quirofanos/${id}`)
      toast.success('Quirófano eliminado')
      fetchQuirofanos()
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      estado: 'Disponible'
    })
    setEditingId(null)
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Gestiona los quirófanos del hospital</p>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Quirófano'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Quirófano' : 'Crear Quirófano'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="nombre" placeholder="Nombre del Quirófano (ej: Quirófano 1)" value={formData.nombre} onChange={handleInputChange} className="px-4 py-2 border rounded-lg" required />
            <select name="estado" value={formData.estado} onChange={handleInputChange} className="px-4 py-2 border rounded-lg">
              <option value="Disponible">Disponible</option>
              <option value="Ocupado">Ocupado</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
              <option value="Limpieza">Limpieza</option>
            </select>
            <button type="submit" className="col-span-1 md:col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        {dataLoading ? (
          <p className="text-center py-8 text-gray-500">Cargando quirófanos...</p>
        ) : quirofanos.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay quirófanos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Nombre</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">Estado</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quirofanos.map(quirofano => (
                  <tr key={quirofano.id_quirofano} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{quirofano.nombre}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        quirofano.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                        quirofano.estado === 'Ocupado' ? 'bg-red-100 text-red-800' :
                        quirofano.estado === 'Limpieza' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quirofano.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button onClick={() => setSelectedQuirofano(quirofano)} className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">Ver</button>
                      <button onClick={() => handleEdit(quirofano)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">Editar</button>
                      <button onClick={() => handleDelete(quirofano.id_quirofano)} className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedQuirofano && <Modal title={`${selectedQuirofano.nombre}`} onClose={() => setSelectedQuirofano(null)}>
        <div className="space-y-2">
          <p><strong>Nombre:</strong> {selectedQuirofano.nombre}</p>
          <p><strong>Estado:</strong> {selectedQuirofano.estado}</p>
        </div>
      </Modal>}
    </>
  )
}