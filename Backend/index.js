// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importamos nuestra conexión a la BD
const { pool } = require('./config/database');

// Importamos nuestras rutas
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const pacienteRoutes = require('./routes/pacienteRoutes');

// Cargar variables de entorno lo más pronto posible
dotenv.config();

// Verificar que JWT_SECRET esté definido
if (!process.env.JWT_SECRET) {
    console.error('⚠️ ADVERTENCIA: JWT_SECRET no está definido en el archivo .env');
    process.env.JWT_SECRET = 'clave_secreta_temporal_no_usar_en_produccion';
}

const app = express();
const PORT = process.env.PORT || 3001; // Usamos 3001 para no chocar con React (5173)

// ------------------------------------------------------------------
// 🔥 Middlewares GLOBALES: DEBEN IR ANTES DE CUALQUIER DEFINICIÓN DE RUTA
// ------------------------------------------------------------------

// 1. Permite solicitudes CORS (Cross-Origin Resource Sharing)
app.use(cors()); 

// 2. Middleware para parsear JSON (esencial para que req.body funcione)
app.use(express.json()); 

// Middleware para loguear las peticiones (ayuda en desarrollo)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ------------------------------------------------------------------
// --- Rutas ---
// ------------------------------------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pacientes', pacienteRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: "¡API de MediCare Hospital funcionando!" });
});

// ------------------------------------------------------------------
// Middleware para manejo de errores (DEBE IR AL FINAL)
// ------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});