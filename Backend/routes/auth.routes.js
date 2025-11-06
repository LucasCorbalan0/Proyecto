const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const { 
    iniciarSesion, 
    registrarUsuario, 
    obtenerPerfil 
} = require('../controllers/auth.controller');

// Middleware para proteger rutas que requieren autenticación
const { protect } = require('../middleware/auth.middleware');



// Iniciar sesión (login)
router.post('/login', iniciarSesion);

// Registrar un nuevo usuario
router.post('/register', registrarUsuario);

// Obtener el perfil del usuario actualmente logueado
router.get('/profile', protect, obtenerPerfil);

module.exports = router;
