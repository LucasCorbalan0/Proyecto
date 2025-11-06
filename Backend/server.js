// Archivo: server.js
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');


// Cargar variables de entorno
dotenv.config();

// Rutas a importar: Importamos nuestro archivo de rutas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin.routes');

// Instancio Express
const app = express();
const PORT = process.env.PORT || 3001; // Usamos 3001 como en el frontend

// Habilita CORS para permitir el acceso desde el frontend React
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Utilizo librería: Permite que Express lea JSON
app.use(express.json());

// Montamos las rutas de autenticación en /api/auth
app.use("/api/auth", authRoutes); // Este es el equivalente a app.use("/", usuarios)
app.use("/api/admin", adminRoutes); // Rutas de administración
// Ruta de prueba
app.get("/api", (req, res) => {
    res.send("API de Gestión Hospitalaria funcionando.");
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});