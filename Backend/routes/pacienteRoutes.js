const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { protect } = require('../middleware/auth.middleware');



// Dashboard principal del paciente con toda la info
router.get('/dashboard/:id_paciente', pacienteController.getDashboardResumen);



// Obtener datos completos del paciente
router.get('/datos/:id_paciente', pacienteController.getDatosPaciente);

// Actualizar datos del paciente
router.put('/datos/:id_paciente', pacienteController.actualizarDatosPaciente);


// Obtener historia clínica del paciente
router.get('/:id_paciente/historia-clinica', pacienteController.getHistoriaClinica);
// Crear o actualizar historia clínica
router.put('/:id_paciente/historia-clinica', pacienteController.actualizarHistoriaClinica);



// Cancelar un turno
router.put('/turnos/:id_turno/cancelar', pacienteController.cancelarTurno);



// Obtener todos los estudios del paciente
router.get('/estudios/:id_paciente', pacienteController.getEstudios);



// Obtener todas las recetas del paciente
router.get('/recetas/:id_paciente', pacienteController.getRecetas);



// Obtener todas las consultas del paciente
router.get('/consultas/:id_paciente', pacienteController.getConsultas);



// Obtener todas las facturas del paciente
router.get('/facturas/:id_paciente', pacienteController.getFacturas);



// Obtener todas las especialidades
router.get('/especialidades', pacienteController.getEspecialidades);

// Obtener médicos con filtros opcionales
router.get('/medicos', pacienteController.getMedicos);

// Obtener disponibilidad de un médico
router.get('/disponibilidad/:id_medico', pacienteController.getDisponibilidadMedicos);

// Reservar turno con médico
router.post('/:id_paciente/reservar-turno', pacienteController.reservarTurno);

module.exports = router;