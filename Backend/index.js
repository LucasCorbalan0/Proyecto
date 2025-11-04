// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importamos nuestra conexión a la BD

// Importaremos nuestras rutas aquí (más adelante)
// import authRoutes from './routes/auth.routes.js';
// import pacientesRoutes from './routes/pacientes.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Usamos 3001 para no chocar con React (5173)

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// --- Rutas ---
// app.use('/api/auth', authRoutes);
// app.use('/api/pacientes', pacientesRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: "¡API de MediCare Hospital funcionando!" });
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});