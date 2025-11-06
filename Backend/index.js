const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importamos nuestra conexión a la BD
const { pool } = require('./config/database');

// Importamos nuestras rutas
const authRoutes = require('./routes/auth.routes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const adminRoutes = require('./routes/admin.routes'); // ✅ añadida

// Cargar variables de entorno
dotenv.config();

// Verificar que JWT_SECRET esté definido
if (!process.env.JWT_SECRET) {
  console.error('⚠️ ADVERTENCIA: JWT_SECRET no está definido en el archivo .env');
  process.env.JWT_SECRET = 'clave_secreta_temporal_no_usar_en_produccion';
}

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------------------------------------------------
// 🔹 Middlewares globales
// ------------------------------------------------------------
app.use(cors());
app.use(express.json());

// Log de peticiones (útil para desarrollo)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ------------------------------------------------------------
// 🔹 Rutas
// ------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/admin', adminRoutes); // ✅ NUEVA RUTA montada

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: "¡API de MediCare Hospital funcionando!" });
});

// ------------------------------------------------------------
// 🔹 Middleware para errores
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
});

// ------------------------------------------------------------
// 🔹 Servidor en marcha
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
