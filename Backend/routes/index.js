// Inicialización de express
const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./authRoutes');
const pacienteRoutes = require('./pacienteRoutes');

// Configurar rutas
router.use('/auth', authRoutes);
router.use('/pacientes', pacienteRoutes);

module.exports = router;