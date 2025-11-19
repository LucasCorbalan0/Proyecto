// Inicialización de express
const express = require("express");
const router = express.Router();

// Importar rutas
const authRoutes = require("./authRoutes");
const pacienteRoutes = require("./pacienteRoutes");
const stockRoutes = require("./stockRoutes");

// Configurar rutas
router.use("/auth", authRoutes);
router.use("/pacientes", pacienteRoutes);
router.use("/stock", stockRoutes);

module.exports = router;
