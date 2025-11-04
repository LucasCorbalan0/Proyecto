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

            // Get user from database
            const [rows] = await db.execute(
                `SELECT u.id, u.nombre_usuario, u.id_rol_sistema, 
                        p.nombre, p.apellido, p.email, p.dni
                FROM usuarios u
                JOIN personas p ON u.id_persona = p.id_persona
                WHERE u.id = ?`,
                [decoded.id]
            );

            if (rows.length === 0) {
                res.status(401);
                throw new Error('No autorizado');
            }

            req.user = rows[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('No autorizado');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('No autorizado, no hay token');
    }
});

module.exports = {
    protect
};