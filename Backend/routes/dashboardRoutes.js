const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

/* =====================================================
   📊 RUTAS DASHBOARD ADMIN
===================================================== */

// Obtener dashboard general con todas las estadísticas
router.get('/admin', protect, dashboardController.obtenerDashboardAdmin);

// Obtener pacientes actualmente internados
router.get('/admin/pacientes-internados', protect, dashboardController.getPacientesInternados);

// Obtener últimas facturas
router.get('/admin/ultimas-facturas', protect, dashboardController.getUltimasFacturas);

// Obtener próximas cirugías programadas
router.get('/admin/proximas-cirugias', protect, dashboardController.getProximasCirugias);

// Obtener especialidades más solicitadas
router.get('/admin/especialidades-populares', protect, dashboardController.getEspecialidadesPopulares);

module.exports = router;
