const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require('../config/database');

// Middleware para proteger rutas privadas mediante JWT
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Verificamos que el encabezado Authorization exista y comience con "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtenemos el token (segunda parte del string "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verificamos que el token sea válido y no esté expirado
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscamos el usuario correspondiente en la base de datos
            const [rows] = await db.execute(
                `
                SELECT u.id, u.nombre_usuario, u.id_rol_sistema, 
                       p.nombre, p.apellido, p.email, p.dni
                FROM usuarios u
                JOIN personas p ON u.id_persona = p.id_persona
                WHERE u.id = ?
                `,
                [decoded.id]
            );

            // Si no encontramos al usuario, negamos el acceso
            if (rows.length === 0) {
                res.status(401);
                throw new Error('No autorizado');
            }

            // Guardamos los datos del usuario en la request para usarlos en la ruta
            req.user = rows[0];
            next(); // Continuamos con el siguiente middleware o controlador

        } catch (error) {
            console.error('Error en protect middleware:', error.message);
            res.status(401);
            throw new Error('No autorizado');
        }
    }

    // Si no se envió ningún token
    if (!token) {
        res.status(401);
        throw new Error('No autorizado, no se encontró token');
    }
});

module.exports = { protect };
