import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiClient from '../../../../services/apiClient'
import { api } from '../services/api'

export function CuentaContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [isEditingContacto, setIsEditingContacto] = useState(false);
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
        
        const responsePaciente = await apiClient.get(`/pacientes/datos/${idPaciente}`, {
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
          // The backend may return data as an object or an array depending on the endpoint.
          const rawPaciente = responsePaciente.data.data !== undefined ? responsePaciente.data.data : responsePaciente.data;
          const rawHistoria = responseHistoria.data.data !== undefined ? responseHistoria.data.data : responseHistoria.data;

          const pacienteData = Array.isArray(rawPaciente) ? rawPaciente[0] : rawPaciente || {};
          const historiaData = Array.isArray(rawHistoria) ? rawHistoria[0] : rawHistoria || {};

          const datosActualizados = {
            nombre: pacienteData?.nombres || pacienteData?.nombre || '',
            apellido: pacienteData?.apellidos || pacienteData?.apellido || '',
            email: pacienteData?.email || '',
            dni: pacienteData?.documento || pacienteData?.dni || '',
            fechaNacimiento: pacienteData?.fecha_nacimiento || '',
            obraSocial: pacienteData?.obra_social || '',
            telefono: pacienteData?.telefono || '',
            direccion: pacienteData?.direccion || '',
            grupoSanguineo: historiaData?.tipo_sangre || historiaData?.grupo_sanguineo || '',
            alergias: historiaData?.alergias_conocidas || historiaData?.alergias || '',
            condicionesCronicas: historiaData?.comorbilidades_cronicas || historiaData?.condiciones_cronicas || '',
            medicacionActual: historiaData?.medicacion_habitual || historiaData?.medicacion_actual || '',
            antecedentesQuirurgicos: historiaData?.antecedentes_quirurgicos || '',
            contactoEmergenciaNombre: historiaData?.contacto_emergencia_nombre || '',
            contactoEmergenciaTelefono: historiaData?.contacto_emergencia_telefono || '',
            contactoEmergenciaRelacion: historiaData?.contacto_emergencia_relacion || ''
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
      // Enviar solo los campos editables
      const payload = {
        telefono: datosPersonales.telefono || null,
        direccion: datosPersonales.direccion || null,
        email: datosPersonales.email || null
      };

      const response = await apiClient.put(`/pacientes/datos/${idPaciente}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Actualizar estado con lo que devuelva el backend (normalizado por api.js si es usado allí)
      const updated = response.data?.data || response.data;
      if (updated) {
        setDatosPersonales(prev => ({ ...prev, telefono: updated.telefono || prev.telefono, direccion: updated.direccion || prev.direccion, email: updated.email || prev.email }));
      }
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
              {isEditing ? (
                <input
                  type="email"
                  value={datosPersonales.email}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-900 font-medium">{datosPersonales.email || "No especificado"}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Teléfono</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datosPersonales.telefono}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, telefono: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-900 font-medium">{datosPersonales.telefono || "No especificado"}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 mb-1 block">Dirección</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datosPersonales.direccion}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, direccion: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-900 font-medium">{datosPersonales.direccion || "No especificado"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información Médica */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Médica</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-500">Datos médicos</h3>
              {!isEditingMedical ? (
                <button onClick={() => setIsEditingMedical(true)} className="text-sm text-blue-600 hover:underline">Editar</button>
              ) : null}
            </div>

            {isEditingMedical ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Grupo Sanguíneo</label>
                  <input value={datosPersonales.grupoSanguineo} onChange={e => setDatosPersonales(prev => ({ ...prev, grupoSanguineo: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Alergias</label>
                  <input value={datosPersonales.alergias} onChange={e => setDatosPersonales(prev => ({ ...prev, alergias: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Condiciones Crónicas</label>
                  <input value={datosPersonales.condicionesCronicas} onChange={e => setDatosPersonales(prev => ({ ...prev, condicionesCronicas: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Medicación habitual</label>
                  <input value={datosPersonales.medicacionActual} onChange={e => setDatosPersonales(prev => ({ ...prev, medicacionActual: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Antecedentes Quirúrgicos</label>
                  <input value={datosPersonales.antecedentesQuirurgicos} onChange={e => setDatosPersonales(prev => ({ ...prev, antecedentesQuirurgicos: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => {
                    // Guardar cambios médicos
                    try {
                      setLoading(true);
                      const idPaciente = localStorage.getItem('id_paciente');
                      const payload = {
                        tipo_sangre: datosPersonales.grupoSanguineo || null,
                        alergias_conocidas: datosPersonales.alergias || null,
                        comorbilidades_cronicas: datosPersonales.condicionesCronicas || null,
                        medicacion_habitual: datosPersonales.medicacionActual || null,
                        antecedentes_quirurgicos: datosPersonales.antecedentesQuirurgicos || null
                      };
                      const updated = await api.actualizarHistoriaClinica(idPaciente, payload);
                      // actualizar estado local con la respuesta
                      setDatosPersonales(prev => ({
                        ...prev,
                        grupoSanguineo: updated.tipo_sangre || prev.grupoSanguineo,
                        alergias: updated.alergias_conocidas || prev.alergias,
                        condicionesCronicas: updated.comorbilidades_cronicas || prev.condicionesCronicas,
                        medicacionActual: updated.medicacion_habitual || prev.medicacionActual,
                        antecedentesQuirurgicos: updated.antecedentes_quirurgicos || prev.antecedentesQuirurgicos
                      }));
                      setIsEditingMedical(false);
                      toast.success('Información médica actualizada');
                    } catch (err) {
                      console.error('Error al actualizar historia clínica:', err);
                      toast.error('Error al guardar información médica');
                    } finally { setLoading(false); }
                  }} className="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                  <button onClick={() => { setIsEditingMedical(false); }} className="px-4 py-2 border rounded-md">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Grupo Sanguíneo</label>
                  <p className="text-gray-900 font-medium">{datosPersonales.grupoSanguineo || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Alergias</label>
                  <p className="text-gray-900 font-medium">{datosPersonales.alergias || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Condiciones Crónicas</label>
                  <p className="text-gray-900 font-medium">{datosPersonales.condicionesCronicas || 'No especificado'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contacto de Emergencia */}
        <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contacto de Emergencia</h2>
          {!isEditingContacto ? (
            <button onClick={() => setIsEditingContacto(true)} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">Editar</button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isEditingContacto ? (
            <>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Nombre</label>
                <input value={datosPersonales.contactoEmergenciaNombre} onChange={e => setDatosPersonales(prev => ({ ...prev, contactoEmergenciaNombre: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Relación</label>
                <input value={datosPersonales.contactoEmergenciaRelacion} onChange={e => setDatosPersonales(prev => ({ ...prev, contactoEmergenciaRelacion: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Teléfono</label>
                <input value={datosPersonales.contactoEmergenciaTelefono} onChange={e => setDatosPersonales(prev => ({ ...prev, contactoEmergenciaTelefono: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-3 flex gap-2 mt-2">
                <button onClick={async () => {
                  try {
                    setLoading(true);
                    const idPaciente = localStorage.getItem('id_paciente');
                    const payload = {
                      contacto_emergencia_nombre: datosPersonales.contactoEmergenciaNombre || null,
                      contacto_emergencia_telefono: datosPersonales.contactoEmergenciaTelefono || null,
                      contacto_emergencia_relacion: datosPersonales.contactoEmergenciaRelacion || null
                    };
                    const updated = await api.actualizarHistoriaClinica(idPaciente, payload);
                    setDatosPersonales(prev => ({
                      ...prev,
                      contactoEmergenciaNombre: updated.contacto_emergencia_nombre || prev.contactoEmergenciaNombre,
                      contactoEmergenciaTelefono: updated.contacto_emergencia_telefono || prev.contactoEmergenciaTelefono,
                      contactoEmergenciaRelacion: updated.contacto_emergencia_relacion || prev.contactoEmergenciaRelacion
                    }));
                    setIsEditingContacto(false);
                    toast.success('Contacto de emergencia actualizado');
                  } catch (err) {
                    console.error('Error al actualizar contacto de emergencia:', err);
                    toast.error('Error al guardar contacto de emergencia');
                  } finally { setLoading(false); }
                }} className="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                <button onClick={() => setIsEditingContacto(false)} className="px-4 py-2 border rounded-md">Cancelar</button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Nombre</label>
                <p className="text-gray-900 font-medium">{datosPersonales.contactoEmergenciaNombre || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Relación</label>
                <p className="text-gray-900 font-medium">{datosPersonales.contactoEmergenciaRelacion || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Teléfono</label>
                <p className="text-gray-900 font-medium">{datosPersonales.contactoEmergenciaTelefono || 'No especificado'}</p>
              </div>
            </>
          )}
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
