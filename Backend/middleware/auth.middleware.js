// Archivo: Backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require('../config/database');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Determinar el ID del usuario en el payload (compatible con 'id' o 'id_usuario')
            const userId = decoded.id || decoded.id_usuario; 
            
            if (!userId) {
                res.status(401);
                throw new Error('Token inválido: Falta ID de usuario en el payload');
            }
            
            // Get user from database
            const [rows] = await db.execute(
                // CORRECCIÓN: Usamos u.id_usuario y le damos un alias 'id' para consistencia con el frontend
                `SELECT u.id_usuario AS id, u.nombre_usuario, u.id_rol_sistema, 
                        p.nombre, p.apellido, p.email, p.dni
                FROM usuarios u
                JOIN personas p ON u.id_persona = p.id_persona
                WHERE u.id_usuario = ?`, // CORRECCIÓN: Usamos id_usuario en la cláusula WHERE
                [userId]
            );

            if (rows.length === 0) {
                res.status(401);
                throw new Error('No autorizado');
            }

            req.user = rows[0];
            next();
        } catch (error) {
            console.error('Error de verificación JWT:', error);
            // Mostrar error específico de SQL solo para diagnóstico interno
            if (error.code === 'ER_BAD_FIELD_ERROR') {
                 console.error('❌ Error al ejecutar la consulta SQL:', error.message);
            }
            res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
});

module.exports = {
    protect
};