const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const { protect } = require('../middleware/auth.middleware');

/* =====================================================
   👨‍⚕️ RUTAS MÉDICOS
===================================================== */

// Obtener todos los médicos
router.get('/', protect, medicoController.obtenerMedicos);

// Obtener un médico por ID
router.get('/:id_medico', protect, medicoController.obtenerMedicoPorId);

// Crear un nuevo médico
router.post('/', protect, medicoController.crearMedico);

// Actualizar un médico
router.put('/:id_medico', protect, medicoController.actualizarMedico);

// Eliminar un médico
router.delete('/:id_medico', protect, medicoController.eliminarMedico);

/* =====================================================
   ⏰ RUTAS DISPONIBILIDAD DE MÉDICOS
===================================================== */

// Obtener disponibilidad de un médico
router.get('/:id_medico/disponibilidad', protect, medicoController.obtenerDisponibilidad);

// Agregar disponibilidad
router.post('/:id_medico/disponibilidad', protect, medicoController.agregarDisponibilidad);

// Eliminar disponibilidad
router.delete('/disponibilidad/:id_disponibilidad', protect, medicoController.eliminarDisponibilidad);

module.exports = router;
