import apiClient from '../../../../services/apiClient';

// Funciones de API para el dashboard de pacientes
export const api = {
  // RF-06: Búsqueda de médicos y gestión de turnos
  getEspecialidades: async () => {
    try {
      console.log('Obteniendo especialidades...');
      const response = await apiClient.get('/especialidades');
      console.log('Respuesta especialidades:', response.data);
      return response.data;
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
      const response = await apiClient.get('/medicos', {
        params: { especialidad, nombre }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener médicos:', error)
      throw error
    }
  },

  getDisponibilidadMedico: async (medicoId, fecha) => {
    try {
      const response = await apiClient.get(`/disponibilidad_medicos/${medicoId}`, {
        params: { fecha }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener disponibilidad:', error)
      throw error
    }
  },

  // RF-06: Reserva de turnos
  reservarTurno: async (medicoId, fecha, hora, pacienteId) => {
    try {
      const response = await apiClient.post('/turnos', {
        medico_id: medicoId,
        fecha,
        hora,
        paciente_id: pacienteId,
        estado: 'Reservado'
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
      const response = await apiClient.get(`/turnos/paciente/${pacienteId}`, {
        params: { estado: ['Reservado', 'En Espera'] }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener turnos:', error)
      throw error
    }
  },

  cancelarTurno: async (turnoId) => {
    try {
      const response = await apiClient.put(`/turnos/${turnoId}`, {
        estado: 'Cancelado'
      })
      return response.data
    } catch (error) {
      console.error('Error al cancelar turno:', error)
      throw error
    }
  },

  // RF-08: Recetas electrónicas
  getRecetasActivas: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/recetas/paciente/${pacienteId}`, {
        params: { estado: 'Activa' }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener recetas:', error)
      throw error
    }
  },

  getDetalleReceta: async (recetaId) => {
    try {
      const response = await apiClient.get(`/recetas/${recetaId}/detalle`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle de receta:', error)
      throw error
    }
  },

  // RF-09: Estudios médicos
  getEstudiosMedicos: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/estudiosmedicos/paciente/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener estudios médicos:', error)
      throw error
    }
  },

  getInformeEstudio: async (estudioId) => {
    try {
      const response = await apiClient.get(`/estudiosmedicos/${estudioId}/informe`, {
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
      const response = await apiClient.get(`/facturacion/paciente/${pacienteId}/resumen`)
      return response.data
    } catch (error) {
      console.error('Error al obtener resumen de facturación:', error)
      throw error
    }
  },

  getDetalleFacturacion: async (facturaId) => {
    try {
      const response = await apiClient.get(`/facturacion/${facturaId}/detalle`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle de facturación:', error)
      throw error
    }
  },

  getHistorialPagos: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pagos/paciente/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error)
      throw error
    }
  },

  // RF-12: Gestión de datos personales
  getDatosPersonales: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/personas/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener datos personales:', error)
      throw error
    }
  },

  actualizarDatosPersonales: async (pacienteId, datos) => {
    try {
      const response = await apiClient.put(`/personas/${pacienteId}`, datos)
      return response.data
    } catch (error) {
      console.error('Error al actualizar datos personales:', error)
      throw error
    }
  }
}
