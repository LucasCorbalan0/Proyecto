const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Rutas del dashboard y turnos
router.get('/dashboard/:id_paciente', pacienteController.getDashboardResumen);
router.put('/turnos/:id_turno/cancelar', pacienteController.cancelarTurno);

// Rutas para datos del paciente
router.get('/datos/:id_paciente', pacienteController.getDatosPaciente);
router.get('/:id_paciente/historia-clinica', pacienteController.getHistoriaClinica);
router.put('/datos/:id_paciente', pacienteController.actualizarDatosPaciente);

// Rutas para estudios y recetas
router.get('/estudios/:id_paciente', pacienteController.getEstudios);
router.get('/recetas/:id_paciente', pacienteController.getRecetas);



module.exports = router;