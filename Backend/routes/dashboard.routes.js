const express = require('express');
const router = express.Router();
const { 
    getDashboardPaciente, 
    getRecetasPaciente,
    getEstudiosPaciente,
    getTurnosPaciente,
    cancelarTurno 
} = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

// Rutas del dashboard del paciente (todas protegidas)
router.get('/pacientes/dashboard/:id_paciente', protect, getDashboardPaciente);
router.get('/pacientes/recetas/:id_paciente', protect, getRecetasPaciente);
router.get('/pacientes/estudios/:id_paciente', protect, getEstudiosPaciente);
router.get('/pacientes/turnos/:id_paciente', protect, getTurnosPaciente);
router.put('/pacientes/turnos/:id_turno/cancelar', protect, cancelarTurno);

module.exports = router;