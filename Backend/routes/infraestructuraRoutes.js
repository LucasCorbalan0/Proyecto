// Backend/routes/infraestructuraRoutes.js
const express = require('express');
const router = express.Router();
const { 
    obtenerInfraestructura, 
    crearInfraestructura, 
    actualizarInfraestructura, 
    eliminarInfraestructura,
    ocuparCama 
} = require('../controllers/infraestructuraController');

const { protect } = require('../middleware/auth.middleware');

// Rutas para gestionar las habitaciones e infraestructura
// Todas las rutas requieren autenticación
router.route('/habitaciones')
    .get(protect, obtenerInfraestructura)
    .post(protect, crearInfraestructura);

router.route('/habitaciones/:id')
    .put(protect, actualizarInfraestructura)
    .delete(protect, eliminarInfraestructura);

// Ruta para marcar una cama como ocupada
router.post('/camas/ocupar/:habitacionId', protect, ocuparCama);

module.exports = router;
