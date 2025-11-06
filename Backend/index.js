const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database');

// Rutas del proyecto
const authRoutes = require('./routes/auth.routes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const adminRoutes = require('./routes/admin.routes');
const infraestructuraRoutes = require('./routes/infraestructuraRoutes');

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('⚠️ JWT_SECRET no está definido en .env');
  process.env.JWT_SECRET = 'clave_temporal_no_usar_en_produccion';
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares principales
app.use(cors());
app.use(express.json());

// Log básico de peticiones (útil en desarrollo)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/infraestructura', infraestructuraRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API del sistema hospital funcionando correctamente' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en marcha: http://localhost:${PORT}`);
});
