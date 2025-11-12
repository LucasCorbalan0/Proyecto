const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { protect } = require('../middleware/auth.middleware');

/* =====================================================
   📋 RUTAS DASHBOARD PACIENTE
===================================================== */

// Dashboard principal del paciente con toda la info
router.get('/dashboard/:id_paciente', pacienteController.getDashboardResumen);

/* =====================================================
   👤 RUTAS DATOS PERSONALES
===================================================== */

// Obtener datos completos del paciente
router.get('/datos/:id_paciente', pacienteController.getDatosPaciente);

// Actualizar datos del paciente
router.put('/datos/:id_paciente', pacienteController.actualizarDatosPaciente);

/* =====================================================
   📖 RUTAS HISTORIA CLÍNICA
===================================================== */

// Obtener historia clínica del paciente
router.get('/:id_paciente/historia-clinica', pacienteController.getHistoriaClinica);
// Crear o actualizar historia clínica
router.put('/:id_paciente/historia-clinica', pacienteController.actualizarHistoriaClinica);

/* =====================================================
   📅 RUTAS TURNOS
===================================================== */

// Cancelar un turno
router.put('/turnos/:id_turno/cancelar', pacienteController.cancelarTurno);

/* =====================================================
   🔬 RUTAS ESTUDIOS MÉDICOS
===================================================== */

// Obtener todos los estudios del paciente
router.get('/estudios/:id_paciente', pacienteController.getEstudios);

/* =====================================================
   💊 RUTAS RECETAS
===================================================== */

// Obtener todas las recetas del paciente
router.get('/recetas/:id_paciente', pacienteController.getRecetas);

/* =====================================================
   📋 RUTAS CONSULTAS
===================================================== */

// Obtener todas las consultas del paciente
router.get('/consultas/:id_paciente', pacienteController.getConsultas);

/* =====================================================
   💰 RUTAS FACTURAS
===================================================== */

// Obtener todas las facturas del paciente
router.get('/facturas/:id_paciente', pacienteController.getFacturas);

/* =====================================================
   🏥 RUTAS BUSCAR MÉDICOS
===================================================== */

// Obtener todas las especialidades
router.get('/especialidades', pacienteController.getEspecialidades);

// Obtener médicos con filtros opcionales
router.get('/medicos', pacienteController.getMedicos);

// Obtener disponibilidad de un médico
router.get('/disponibilidad/:id_medico', pacienteController.getDisponibilidadMedicos);

// Reservar turno con médico
router.post('/:id_paciente/reservar-turno', pacienteController.reservarTurno);

module.exports = router;