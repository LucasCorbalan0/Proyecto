const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { execute } = require('../config/database');

const login = asyncHandler(async (req, res) => {
    const { nombre_usuario, password } = req.body;

    if (!nombre_usuario || !password) {
        res.status(400);
        throw new Error('Por favor complete todos los campos');
    }

    // Verificar si el usuario existe y obtener datos de persona
    const query = `
        SELECT u.*, p.nombre, p.apellido, p.dni, p.email
        FROM usuarios u
        JOIN personas p ON u.id_persona = p.id_persona
        WHERE u.nombre_usuario = ?
    `;
    const [rows] = await execute(query, [nombre_usuario]);

    if (rows.length === 0) {
        res.status(401);
        throw new Error('Credenciales inválidas');
    }

    const usuario = rows[0];

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Credenciales inválidas');
    }

    // Crear token
    const token = jwt.sign(
        { 
            id: usuario.id,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.id_rol_sistema,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.json({
        token,
        usuario: {
            id: usuario.id,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.id_rol_sistema,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email
        }
    });
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    console.log('Datos recibidos:', req.body);
    
    const {
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        email,
        telefono,
        nombre_usuario,
        password,
        id_rol_sistema
    } = req.body;

    // Validación básica
    if (!nombre || !apellido || !dni || !fecha_nacimiento || !email || !nombre_usuario || !password) {
        res.status(400);
        throw new Error('Por favor complete todos los campos requeridos');
    }

    // Verificar si el usuario o DNI ya existe
    const [existingData] = await execute(
        `SELECT u.nombre_usuario, p.dni, p.email
         FROM usuarios u
         LEFT JOIN personas p ON p.id_persona = u.id_persona
         WHERE u.nombre_usuario = ? 
         OR p.dni = ?
         OR p.email = ?`,
        [nombre_usuario, dni, email]
    );

    if (existingData.length > 0) {
        res.status(400);
        if (existingData[0].nombre_usuario === nombre_usuario) {
            throw new Error('El nombre de usuario ya está registrado');
        } else if (existingData[0].dni === dni) {
            throw new Error('El DNI ya está registrado');
        } else {
            throw new Error('El email ya está registrado');
        }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Primero creamos el registro en la tabla personas
    const [personaResult] = await execute(
        `INSERT INTO personas (
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            email,
            telefono
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            email,
            telefono || null
        ]
    );

    if (!personaResult.insertId) {
        res.status(400);
        throw new Error('Error al registrar los datos personales');
    }

    // Luego creamos el usuario asociado a la persona
    const [usuarioResult] = await execute(
        `INSERT INTO usuarios (
            id_persona,
            nombre_usuario,
            password,
            id_rol_sistema
        ) VALUES (?, ?, ?, ?)`,
        [
            personaResult.insertId,
            nombre_usuario,
            hashedPassword,
            id_rol_sistema || 6 // Por defecto, rol de paciente (6)
        ]
    );

    if (usuarioResult.affectedRows === 1) {
        // También creamos el registro en la tabla pacientes
        await execute(
            `INSERT INTO pacientes (id_persona) VALUES (?)`,
            [personaResult.insertId]
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente'
        });
    } else {
        res.status(400);
        throw new Error('Error al registrar el usuario');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const [rows] = await execute(
        'SELECT id, nombre, apellido, dni, fecha_nacimiento, email, telefono, nombre_usuario, id_rol_sistema FROM usuarios WHERE id = ?',
        [req.user.id]
    );

    if (rows.length === 0) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    res.json(rows[0]);
});

module.exports = {
    login,
    register,
    getProfile
};