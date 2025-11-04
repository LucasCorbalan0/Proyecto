// Archivo: middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const asyncHandler = require('express-async-handler'); // npm install express-async-handler

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const [rows] = await pool.query(
                `SELECT 
                    u.id_usuario, u.id_persona, r.nombre AS rol
                 FROM usuarios u
                 JOIN rolessistema r ON u.id_rol_sistema = r.id_rol_sistema
                 WHERE u.id_usuario = ?`,
                [decoded.id_usuario]
            );

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Token fallido, usuario no encontrado' });
            }

            // Adjuntamos el rol y la persona al objeto req
            req.user = {
                id_usuario: rows[0].id_usuario,
                id_persona: rows[0].id_persona,
                rol: rows[0].rol // Esto será "PACIENTE", "MEDICO", "ADMIN", etc.
            };
            
            next(); 

        } catch (error) {
            console.error('Error de verificación JWT:', error);
            res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
});

module.exports = { protect };