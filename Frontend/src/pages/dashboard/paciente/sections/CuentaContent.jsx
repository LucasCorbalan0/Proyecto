import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../../../services/apiClient'

export function CuentaContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: localStorage.getItem('nombre') || '',
    apellido: localStorage.getItem('apellido') || '',
    email: localStorage.getItem('email') || '',
    fechaNacimiento: '',
    dni: '',
    obraSocial: '',
    telefono: '',
    direccion: '',
    grupoSanguineo: '',
    alergias: '',
    condicionesCronicas: '',
    medicacionActual: '',
    antecedentesQuirurgicos: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaRelacion: '',
    contactoEmergenciaTelefono: ''
  });

  useEffect(() => {
    const fetchDatosPersonales = async () => {
      try {
        setLoading(true);
        const idPaciente = localStorage.getItem('id_paciente');
        const token = localStorage.getItem('token');
        
        if (!idPaciente || !token) {
          throw new Error('No se encontró el ID del paciente o el token de autenticación');
        }
        
        const responsePaciente = await apiClient.get(`/pacientes/${idPaciente}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const responseHistoria = await apiClient.get(`/pacientes/${idPaciente}/historia-clinica`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (responsePaciente.data && responseHistoria.data) {
          const datosActualizados = {
            nombre: responsePaciente.data.nombre,
            apellido: responsePaciente.data.apellido,
            email: responsePaciente.data.email,
            dni: responsePaciente.data.dni,
            fechaNacimiento: responsePaciente.data.fecha_nacimiento,
            obraSocial: responsePaciente.data.obra_social,
            telefono: responsePaciente.data.telefono,
            direccion: responsePaciente.data.direccion,
            grupoSanguineo: responseHistoria.data.grupo_sanguineo,
            alergias: responseHistoria.data.alergias,
            condicionesCronicas: responseHistoria.data.condiciones_cronicas,
            medicacionActual: responseHistoria.data.medicacion_actual,
            antecedentesQuirurgicos: responseHistoria.data.antecedentes_quirurgicos
          };
          
          setDatosPersonales(datosActualizados);
          setError(null);
        }
      } catch (err) {
        console.error('Error al cargar datos personales:', err);
        toast.error('Error al cargar los datos personales');
      } finally {
        setLoading(false);
      }
    };

    fetchDatosPersonales();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const idPaciente = localStorage.getItem('id_paciente');
      const token = localStorage.getItem('token');
      if (!idPaciente || !token) {
        throw new Error('No se encontró el ID del paciente o el token');
      }
      await apiClient.put(`/pacientes/datos/${idPaciente}`, datosPersonales, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsEditing(false);
      toast.success("Datos actualizados correctamente");
    } catch (err) {
      console.error('Error al actualizar datos:', err);
      toast.error("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Cuenta</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
            {isEditing ? (
              <div className="space-x-2">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)} 
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
              >
                Editar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Nombre</label>
              <p className="text-gray-900 font-medium">{datosPersonales.nombre}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Apellido</label>
              <p className="text-gray-900 font-medium">{datosPersonales.apellido}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">DNI</label>
              <p className="text-gray-900 font-medium">{datosPersonales.dni || "No especificado"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Fecha de Nacimiento</label>
              <p className="text-gray-900 font-medium">
                {datosPersonales.fechaNacimiento ? new Date(datosPersonales.fechaNacimiento).toLocaleDateString() : "No especificado"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Obra Social</label>
              <p className="text-gray-900 font-medium">{datosPersonales.obraSocial || "No especificado"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Email</label>
              <p className="text-gray-900 font-medium">{datosPersonales.email || "No especificado"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Teléfono</label>
              <p className="text-gray-900 font-medium">{datosPersonales.telefono || "No especificado"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 mb-1 block">Dirección</label>
              <p className="text-gray-900 font-medium">{datosPersonales.direccion || "No especificado"}</p>
            </div>
          </div>
        </div>

        {/* Información Médica */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Médica</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Grupo Sanguíneo</label>
              <p className="text-gray-900 font-medium">O+</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Alergias</label>
              <p className="text-gray-900 font-medium">Penicilina</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Condiciones Crónicas</label>
              <p className="text-gray-900 font-medium">Hipertensión</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacto de Emergencia */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contacto de Emergencia</h2>
          <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Nombre</label>
            <p className="text-gray-900 font-medium">Carlos González</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Relación</label>
            <p className="text-gray-900 font-medium">Esposo</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Teléfono</label>
            <p className="text-gray-900 font-medium">+54 11 4567-8901</p>
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Seguridad</h2>
        <div className="space-y-3">
          <button className="w-full md:w-auto px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors text-left">
            Cambiar Contraseña
          </button>
          <button className="w-full md:w-auto px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors text-left">
            Configurar Autenticación de Dos Factores
          </button>
        </div>
      </div>
    </div>
  )
}
