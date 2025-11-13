// Configuración: usamos valores de configuración local en los archivos correspondientes.
// Ya no dependemos de un archivo .env para la conexión a la base de datos.

const express = require('express');
const cors = require('cors');
const { pool } = require('./config/database');

// Rutas del proyecto
const authRoutes = require('./routes/auth.routes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const adminRoutes = require('./routes/admin.routes');
const infraestructuraRoutes = require('./routes/infraestructuraRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const medicoRoutes = require('./routes/medicoRoutes');

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
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/medicos', medicoRoutes);



// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor en marcha: http://localhost:${PORT}`);
});
