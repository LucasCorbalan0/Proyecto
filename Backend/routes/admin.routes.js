const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Importamos las funciones del controlador de administración
const { 
    obtenerUsuarios, 
    crearUsuario, 
    actualizarUsuario, 
    cambiarEstadoUsuario, 
    eliminarUsuario 
} = require('../controllers/adminController');


// Obtener todos los usuarios
router.get('/users', protect, obtenerUsuarios);

// Crear un nuevo usuario
router.post('/users', protect, crearUsuario);

// Actualizar un usuario existente
router.put('/users/:id', protect, actualizarUsuario);

// Cambiar el estado (activo/inactivo) de un usuario
router.put('/users/toggle/:id', protect, cambiarEstadoUsuario);

// Eliminar un usuario
router.delete('/users/:id', protect, eliminarUsuario);

module.exports = router;
