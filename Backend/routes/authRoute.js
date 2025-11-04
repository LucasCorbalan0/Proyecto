// Archivo: routes/authRoutes.js
const express = require('express');
const router = express.Router();

const { register, login, profile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // <<-- Importamos el middleware

// Rutas Públicas: Registro y Login
router.post('/register', register);
router.post('/login', login);

// Ruta Privada: Obtener el perfil y el ROL del usuario logueado
router.get('/profile', protect, profile); // <<-- Protegida por JWT

module.exports = router;