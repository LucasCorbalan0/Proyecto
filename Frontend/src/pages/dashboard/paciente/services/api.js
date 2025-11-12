import apiClient from '../../../../services/apiClient';

// Funciones de API para el dashboard de pacientes
export const api = {
  // RF-06: Búsqueda de médicos y gestión de turnos
  getEspecialidades: async () => {
    try {
      console.log('Obteniendo especialidades...');
      const response = await apiClient.get('/pacientes/especialidades');
      console.log('Respuesta especialidades:', response.data);
      const data = response.data.data || response.data;
      // Normalizar nombres de campos
      return Array.isArray(data) ? data.map(e => ({
        id: e.id_especialidad,
        nombre: e.nombre,
        es_quirurgica: e.es_quirurgica
      })) : [];
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      }
      throw error;
    }
  },

  getMedicos: async (especialidad = '', nombre = '') => {
    try {
      const response = await apiClient.get('/pacientes/medicos', {
        params: { id_especialidad: especialidad, busqueda: nombre }
      })
      const data = response.data.data || response.data;
      // Normalizar nombres de campos
      return Array.isArray(data) ? data.map(m => ({
        id: m.id_medico,
        nombre: m.nombres || `${m.nombre} ${m.apellido}`,
        nombres: m.nombre,
        apellidos: m.apellido,
        especialidad: m.especialidad,
        email: m.email,
        telefono: m.telefono,
        matricula: m.matricula,
        total_consultas: m.total_consultas,
        calificacion_promedio: m.calificacion_promedio
      })) : [];
    } catch (error) {
      console.error('Error al obtener médicos:', error)
      throw error
    }
  },

  getDisponibilidadMedico: async (medicoId, fechaInicio, fechaFin) => {
    try {
      const response = await apiClient.get(`/pacientes/disponibilidad/${medicoId}`, {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      })
      return response.data.data || response.data
    } catch (error) {
      console.error('Error al obtener disponibilidad:', error)
      throw error
    }
  },

  // RF-06: Reserva de turnos
  reservarTurno: async (pacienteId, medicoId, fechaTurno, motivo) => {
    try {
      const response = await apiClient.post(`/pacientes/${pacienteId}/reservar-turno`, {
        id_medico: medicoId,
        fecha_turno: fechaTurno,
        motivo
      })
      return response.data
    } catch (error) {
      console.error('Error al reservar turno:', error)
      throw error
    }
  },

  // RF-07: Gestión de turnos del paciente
  getTurnosPaciente: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pacientes/dashboard/${pacienteId}`)
      return response.data.data?.proximosTurnos || []
    } catch (error) {
      console.error('Error al obtener turnos:', error)
      throw error
    }
  },

  cancelarTurno: async (turnoId) => {
    try {
      const response = await apiClient.put(`/pacientes/turnos/${turnoId}/cancelar`)
      return response.data
    } catch (error) {
      console.error('Error al cancelar turno:', error)
      throw error
    }
  },

  // RF-08: Recetas electrónicas
  getRecetasActivas: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pacientes/recetas/${pacienteId}`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error al obtener recetas:', error)
      throw error
    }
  },

  getDetalleReceta: async (recetaId) => {
    try {
      const response = await apiClient.get(`/pacientes/recetas/${recetaId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle de receta:', error)
      throw error
    }
  },

  // RF-09: Estudios médicos
  getEstudiosMedicos: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pacientes/estudios/${pacienteId}`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error al obtener estudios médicos:', error)
      throw error
    }
  },

  getInformeEstudio: async (estudioId) => {
    try {
      const response = await apiClient.get(`/pacientes/estudios/${estudioId}/informe`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener informe:', error)
      throw error
    }
  },

  // RF-10 y RF-11: Facturación y pagos
  getResumenFacturacion: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pacientes/facturas/${pacienteId}`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error al obtener resumen de facturación:', error)
      throw error
    }
  },

  getDetalleFacturacion: async (facturaId) => {
    try {
      const response = await apiClient.get(`/pacientes/facturas/${facturaId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle de facturación:', error)
      throw error
    }
  },

  getHistorialPagos: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pacientes/facturas/${pacienteId}`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error)
      throw error
    }
  },

  // RF-12: Gestión de datos personales
  getDatosPersonales: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pacientes/datos/${pacienteId}`)
      // Normalizar la respuesta: asegurar que siempre devolvamos un objeto
      const raw = response.data.data !== undefined ? response.data.data : response.data
      const payload = Array.isArray(raw) ? raw[0] : raw || {}
      return {
        nombre: payload.nombres || payload.nombre || '',
        apellido: payload.apellidos || payload.apellido || '',
        email: payload.email || '',
        dni: payload.documento || payload.dni || '',
        fecha_nacimiento: payload.fecha_nacimiento || payload.fechaNacimiento || '',
        obra_social: payload.obra_social || payload.obraSocial || '',
        telefono: payload.telefono || '',
        direccion: payload.direccion || '',
        id_paciente: payload.id_paciente || payload.id || null
      }
    } catch (error) {
      console.error('Error al obtener datos personales:', error)
      throw error
    }
  },

  actualizarDatosPersonales: async (pacienteId, datos) => {
    try {
      const response = await apiClient.put(`/pacientes/datos/${pacienteId}`, datos)
      return response.data
    } catch (error) {
      console.error('Error al actualizar datos personales:', error)
      throw error
    }
  },

  // RF-04: Consultas del paciente
  getConsultas: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pacientes/consultas/${pacienteId}`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error al obtener consultas:', error)
      throw error
    }
  },

  // RF-03: Historia clínica
  getHistoriaClinica: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pacientes/${pacienteId}/historia-clinica`)
      const raw = response.data.data !== undefined ? response.data.data : response.data
      const payload = Array.isArray(raw) ? raw[0] : raw || {}
      return {
        id_historia: payload.id_historia || payload.idHistoria || null,
        tipo_sangre: payload.tipo_sangre || payload.tipoSangre || payload.grupo_sanguineo || '',
        factor_rh: payload.factor_rh || payload.factorRh || null,
        alergias_conocidas: payload.alergias_conocidas || payload.alergias || '',
        comorbilidades_cronicas: payload.comorbilidades_cronicas || payload.condiciones_cronicas || '',
        medicacion_habitual: payload.medicacion_habitual || payload.medicacion_actual || '',
        antecedentes_quirurgicos: payload.antecedentes_quirurgicos || '',
        contacto_emergencia_nombre: payload.contacto_emergencia_nombre || payload.contactoEmergenciaNombre || '',
        contacto_emergencia_telefono: payload.contacto_emergencia_telefono || payload.contactoEmergenciaTelefono || ''
      }
    } catch (error) {
      console.error('Error al obtener historia clínica:', error)
      throw error
    }
  }
,

  // Actualizar o crear historia clínica
  actualizarHistoriaClinica: async (pacienteId, datos) => {
    try {
      const response = await apiClient.put(`/pacientes/${pacienteId}/historia-clinica`, datos)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error al actualizar historia clínica:', error)
      throw error
    }
  }
}

