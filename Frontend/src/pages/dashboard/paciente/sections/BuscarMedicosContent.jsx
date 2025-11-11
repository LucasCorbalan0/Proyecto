import { useState, useEffect } from 'react'
import { Calendar, XCircle } from 'lucide-react'
import { api } from '../services/api'

export function BuscarMedicosContent() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [especialidades, setEspecialidades] = useState([])
  const [medicos, setMedicos] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [horariosDisponibles, setHorariosDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const loadEspecialidades = async () => {
      try {
        setLoading(true)
        const data = await api.getEspecialidades()
        console.log('Especialidades cargadas:', data)
        setEspecialidades(data)
      } catch (err) {
        console.error('Error en loadEspecialidades:', err)
        setError("Error al cargar las especialidades")
      } finally {
        setLoading(false)
      }
    }
    loadEspecialidades()
  }, [])

  useEffect(() => {
    const loadMedicos = async () => {
      if (!especialidades.length) return
      
      try {
        setLoading(true)
        const especialidadNombre = especialidades.find(e => e.id === selectedSpecialty)?.nombre || ''
        const data = await api.getMedicos(especialidadNombre, '')
        console.log('Médicos cargados:', data)
        setMedicos(data)
        setError(null)
      } catch (err) {
        console.error('Error en loadMedicos:', err)
        setError("Error al cargar los médicos")
        setMedicos([])
      } finally {
        setLoading(false)
      }
    }

    loadMedicos()
  }, [selectedSpecialty, especialidades])

  const loadHorarios = async (medicoId) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Cargando horarios para médico:', medicoId)
      const data = await api.getDisponibilidadMedico(medicoId, new Date().toISOString().split('T')[0])
      console.log('Horarios obtenidos:', data)
      setHorariosDisponibles(data)
      const medicoSeleccionado = medicos.find(m => m.id === medicoId)
      console.log('Médico seleccionado:', medicoSeleccionado)
      setSelectedDoctor(medicoSeleccionado)
    } catch (err) {
      console.error('Error al cargar horarios:', err)
      setError("Error al cargar los horarios disponibles")
      setHorariosDisponibles([])
    } finally {
      setLoading(false)
    }
  }

  const reservarTurno = async (medicoId, fecha, hora) => {
    try {
      setLoading(true)
      const nuevosHorarios = horariosDisponibles.map(slot => {
        if (slot.fecha === fecha && slot.hora === hora) {
          return { ...slot, disponible: false };
        }
        return slot;
      });
      
      setHorariosDisponibles(nuevosHorarios);
      setSuccessMessage("Turno reservado exitosamente");
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError("Error al reservar el turno")
      console.error('Error en reservarTurno:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Buscar Médicos</h1>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
            Especialidad
          </label>
          <select
            id="specialty"
            className="w-full rounded-lg border border-gray-300 p-2.5"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">Todas las especialidades</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.id}>{esp.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicos.map((medico) => (
          <div key={medico.id} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <img
                src={medico.imagen || "https://via.placeholder.com/64"}
                alt={medico.nombre}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{medico.nombre}</h3>
                <p className="text-blue-600">{medico.especialidad}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{medico.experiencia} años de experiencia</p>
                  {medico.matricula && <p>Matrícula: {medico.matricula}</p>}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 ">
              <button
                onClick={() => loadHorarios(medico.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Ver Horarios Disponibles</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-black">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Horarios Disponibles - {selectedDoctor.nombre}
              </h2>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(
                horariosDisponibles.reduce((acc, slot) => {
                  const fecha = new Date(slot.fecha).toLocaleDateString()
                  if (!acc[fecha]) acc[fecha] = []
                  acc[fecha].push(slot)
                  return acc
                }, {})
              ).map(([fecha, slots]) => (
                <div key={fecha} className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {new Date(slots[0].fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot, index) => (
                      <button
                        key={index}
                        disabled={!slot.disponible || loading}
                        onClick={() => reservarTurno(selectedDoctor.id, slot.fecha, slot.hora)}
                        className={`p-2 rounded-lg text-center ${
                          loading
                            ? "bg-gray-100 text-gray-400 cursor-wait"
                            : slot.disponible
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.hora}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
