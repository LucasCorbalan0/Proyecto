// ============================================================================
// SERVICIO DE PACIENTES - Frontend
// Ubicación: Frontend/src/services/paciente.service.js
// ============================================================================

import apiClient from './apiClient';

/**
 * Servicio para todos los endpoints del paciente
 * Incluye: dashboard, recetas, consultas, estudios, facturas, y búsqueda de médicos
 */

class PacienteService {
  // ========================================================================
  // DASHBOARD
  // ========================================================================

  /**
   * Obtiene todos los datos del dashboard del paciente
   * @param {number} id_paciente - ID del paciente
   * @returns {Promise} Objeto con datos: turnos, recetas, consultas, etc.
   */
  static async getDashboard(id_paciente) {
    try {
      const response = await apiClient.get(`/pacientes/dashboard/${id_paciente}`);
      return response.data;
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      throw error;
    }
  }

  // ========================================================================
  // DATOS PERSONALES
  // ========================================================================

  /**
   * Obtiene los datos personales del paciente
   * @param {number} id_paciente - ID del paciente
   * @returns {Promise} Datos personales (nombre, email, teléfono, etc.)
   */
  static async getDatosPaciente(id_paciente) {
    try {
      const response = await apiClient.get(`/pacientes/datos/${id_paciente}`);
      return response.data;
    } catch (error) {
      console.error('Error al cargar datos del paciente:', error);
      throw error;
    }
  }

  /**
   * Actualiza los datos personales del paciente
   * @param {number} id_paciente - ID del paciente
   * @param {Object} datos - Objeto con datos a actualizar
   * @returns {Promise} Confirmación de actualización
   */
  static async actualizarDatosPaciente(id_paciente, datos) {
    try {
      const response = await apiClient.put(
        `/pacientes/datos/${id_paciente}`,
        datos
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      throw error;
    }
  }

  // ========================================================================
  // HISTORIA CLÍNICA
  // ========================================================================

  /**
   * Obtiene la historia clínica del paciente
   * @param {number} id_paciente - ID del paciente
   * @returns {Promise} Historia clínica con antecedentes, alergias, etc.
   */
  static async getHistoriaClinica(id_paciente) {
    try {
      const response = await apiClient.get(
        `/pacientes/${id_paciente}/historia-clinica`
      );
      return response.data;
    } catch (error) {
      console.error('Error al cargar historia clínica:', error);
      throw error;
    }
  }

  // ========================================================================
  // RECETAS
  // ========================================================================

  /**
   * Obtiene todas las recetas del paciente
   * @param {number} id_paciente - ID del paciente
   * @returns {Promise} Array de recetas con medicamentos y dosis
   */
  static async getRecetas(id_paciente) {
    try {
      const response = await apiClient.get(`/pacientes/recetas/${id_paciente}`);
      return response.data;
    } catch (error) {
      console.error('Error al cargar recetas:', error);
      throw error;
    }
  }

  // ========================================================================
  // CONSULTAS
  // ========================================================================

  /**
   * Obtiene todas las consultas del paciente
   * @param {number} id_paciente - ID del paciente
   * @returns {Promise} Array de consultas con médico, fecha, diagnóstico
   */
  static async getConsultas(id_paciente) {
    try {
      const response = await apiClient.get(
        `/pacientes/consultas/${id_paciente}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al cargar consultas:', error);
      throw error;
    }
  }

  // ========================================================================
  // ESTUDIOS MÉDICOS
  // ========================================================================

  /**
   * Obtiene todos los estudios médicos del paciente
   * @param {number} id_paciente - ID del paciente
   * @returns {Promise} Array de estudios con tipo, estado, fecha
   */
  static async getEstudios(id_paciente) {
    try {
      const response = await apiClient.get(
        `/pacientes/estudios/${id_paciente}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al cargar estudios:', error);
      throw error;
    }
  }

  // ========================================================================
  // FACTURAS
  // ========================================================================

  /**
   * Obtiene todas las facturas del paciente
   * @param {number} id_paciente - ID del paciente
   * @returns {Promise} Array de facturas con monto, fecha, estado
   */
  static async getFacturas(id_paciente) {
    try {
      const response = await apiClient.get(
        `/pacientes/facturas/${id_paciente}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      throw error;
    }
  }

  // ========================================================================
  // TURNOS
  // ========================================================================

  /**
   * Cancela un turno existente
   * @param {number} id_turno - ID del turno a cancelar
   * @returns {Promise} Confirmación de cancelación
   */
  static async cancelarTurno(id_turno) {
    try {
      const response = await apiClient.put(
        `/pacientes/turnos/${id_turno}/cancelar`
      );
      return response.data;
    } catch (error) {
      console.error('Error al cancelar turno:', error);
      throw error;
    }
  }

  // ========================================================================
  // BÚSQUEDA DE MÉDICOS
  // ========================================================================

  /**
   * Obtiene todas las especialidades disponibles
   * @returns {Promise} Array de especialidades
   */
  static async getEspecialidades() {
    try {
      const response = await apiClient.get('/pacientes/especialidades');
      return response.data;
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
      throw error;
    }
  }

  /**
   * Busca médicos con filtros opcionales
   * @param {Object} filtros - Objeto con filtros
   * @param {number} filtros.id_especialidad - (opcional) ID de especialidad
   * @param {string} filtros.busqueda - (opcional) Término de búsqueda
   * @returns {Promise} Array de médicos que coinciden con los filtros
   */
  static async getMedicos(filtros = {}) {
    try {
      const params = new URLSearchParams();
      if (filtros.id_especialidad) {
        params.append('id_especialidad', filtros.id_especialidad);
      }
      if (filtros.busqueda) {
        params.append('busqueda', filtros.busqueda);
      }

      const response = await apiClient.get(
        `/pacientes/medicos?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al buscar médicos:', error);
      throw error;
    }
  }

  /**
   * Obtiene la disponibilidad de un médico en un rango de fechas
   * @param {number} id_medico - ID del médico
   * @param {string} fecha_inicio - Fecha inicio (YYYY-MM-DD)
   * @param {string} fecha_fin - Fecha fin (YYYY-MM-DD)
   * @returns {Promise} Array de disponibilidades del médico
   */
  static async getDisponibilidadMedicos(id_medico, fecha_inicio, fecha_fin) {
    try {
      const params = new URLSearchParams({
        fecha_inicio,
        fecha_fin
      });

      const response = await apiClient.get(
        `/pacientes/disponibilidad/${id_medico}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      throw error;
    }
  }

  /**
   * Reserva un turno con un médico
   * @param {number} id_paciente - ID del paciente
   * @param {Object} datosReserva - Datos del turno a reservar
   * @param {number} datosReserva.id_medico - ID del médico
   * @param {string} datosReserva.fecha_turno - Fecha y hora del turno (YYYY-MM-DD HH:MM:SS)
   * @param {string} datosReserva.motivo - Motivo de la consulta
   * @returns {Promise} Datos del turno creado (id_turno, fecha, etc.)
   */
  static async reservarTurno(id_paciente, datosReserva) {
    try {
      const response = await apiClient.post(
        `/pacientes/${id_paciente}/reservar-turno`,
        datosReserva
      );
      return response.data;
    } catch (error) {
      console.error('Error al reservar turno:', error);
      throw error;
    }
  }
}

export default PacienteService;

// ============================================================================
// EJEMPLOS DE USO EN COMPONENTES REACT
// ============================================================================

/*
import PacienteService from '../services/paciente.service';

// En un componente:

// 1. Cargar dashboard completo
const cargarDashboard = async (id_paciente) => {
  try {
    const data = await PacienteService.getDashboard(id_paciente);
    setDashboard(data.data);
  } catch (error) {
    alert('Error al cargar dashboard');
  }
};

// 2. Buscar médicos
const buscarMedicos = async (id_especialidad) => {
  try {
    const data = await PacienteService.getMedicos({
      id_especialidad,
      busqueda: ''
    });
    setMedicos(data.data);
  } catch (error) {
    alert('Error al buscar médicos');
  }
};

// 3. Ver disponibilidad de un médico
const verDisponibilidad = async (id_medico) => {
  try {
    const data = await PacienteService.getDisponibilidadMedicos(
      id_medico,
      '2024-02-01',
      '2024-02-28'
    );
    setDisponibilidad(data.data);
  } catch (error) {
    alert('Error al cargar disponibilidad');
  }
};

// 4. Reservar turno
const handleReservarTurno = async (id_paciente, id_medico, fecha, motivo) => {
  try {
    const resultado = await PacienteService.reservarTurno(id_paciente, {
      id_medico,
      fecha_turno: `${fecha} 09:00:00`,
      motivo
    });
    alert('¡Turno reservado exitosamente!');
    console.log('Nuevo turno:', resultado.data);
  } catch (error) {
    alert('Error al reservar turno');
  }
};

// 5. Cargar recetas
const cargarRecetas = async (id_paciente) => {
  try {
    const data = await PacienteService.getRecetas(id_paciente);
    setRecetas(data.data);
  } catch (error) {
    alert('Error al cargar recetas');
  }
};
*/
