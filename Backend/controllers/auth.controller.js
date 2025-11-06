const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { execute } = require('../config/database');

/* ---------------------------------------------------
   🔐 INICIO DE SESIÓN (LOGIN)
--------------------------------------------------- */
const iniciarSesion = asyncHandler(async (req, res) => {
    const { nombre_usuario, password } = req.body;

    // Verificamos que se hayan enviado ambos campos
    if (!nombre_usuario || !password) {
        res.status(400);
        throw new Error('Por favor complete todos los campos');
    }

    // Buscamos el usuario en la base de datos
    const consulta = `
        SELECT u.id_usuario, u.nombre_usuario, u.password, u.id_rol_sistema,
               p.nombre, p.apellido, p.dni, p.email, pac.id_paciente
        FROM usuarios u
        JOIN personas p ON u.id_persona = p.id_persona
        LEFT JOIN pacientes pac ON pac.id_persona = p.id_persona
        WHERE u.nombre_usuario = ?
    `;

    const resultado = await execute(consulta, [nombre_usuario]);

    if (resultado.length === 0) {
        res.status(401);
        throw new Error('Credenciales inválidas');
    }

    const usuario = resultado[0];
    const coincide = await bcrypt.compare(password, usuario.password);

    if (!coincide) {
        res.status(401);
        throw new Error('Credenciales inválidas');
    }

    // Generamos el token JWT
    const token = jwt.sign(
        { 
            id: usuario.id_usuario,
            rol: usuario.id_rol_sistema,
            nombre_usuario: usuario.nombre_usuario
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    // Enviamos el usuario logueado con su token
    res.json({
        token,
        usuario: {
            id: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.id_rol_sistema,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            id_paciente: usuario.id_paciente
        }
    });
});

/* ---------------------------------------------------
   🧾 REGISTRO DE NUEVOS USUARIOS
--------------------------------------------------- */
const registrarUsuario = asyncHandler(async (req, res) => {
    console.log('Datos recibidos:', req.body);
    
    const {
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        genero,          
        email,
        telefono,
        nombre_usuario,
        password,
        id_rol_sistema
    } = req.body;

    // Verificamos que no falte ningún dato importante
    if (!nombre || !apellido || !dni || !fecha_nacimiento || !email || !nombre_usuario || !password || !genero) {
        res.status(400);
        throw new Error('Por favor complete todos los campos requeridos');
    }

    // Comprobamos si ya existe ese usuario, DNI o email
    const datosExistentes = await execute(
        `
        SELECT u.nombre_usuario, p.dni, p.email
        FROM usuarios u
        LEFT JOIN personas p ON p.id_persona = u.id_persona
        WHERE u.nombre_usuario = ? 
        OR p.dni = ?
        OR p.email = ?
        `,
        [nombre_usuario, dni, email]
    );

    if (datosExistentes.length > 0) {
        res.status(400);
        if (datosExistentes[0].nombre_usuario === nombre_usuario) {
            throw new Error('El nombre de usuario ya está registrado');
        } else if (datosExistentes[0].dni === dni) {
            throw new Error('El DNI ya está registrado');
        } else {
            throw new Error('El email ya está registrado');
        }
    }

    // Encriptamos la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Insertamos los datos personales en la tabla personas
    const resultadoPersona = await execute(
        `
        INSERT INTO personas (
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            genero,
            email,
            telefono
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            genero,
            email,
            telefono || null
        ]
    );

    if (!resultadoPersona.insertId) {
        res.status(400);
        throw new Error('Error al registrar los datos personales');
    }

    // Insertamos los datos del usuario (login)
    const resultadoUsuario = await execute(
        `
        INSERT INTO usuarios (
            id_persona,
            nombre_usuario,
            password,
            id_rol_sistema
        ) VALUES (?, ?, ?, ?)
        `,
        [
            resultadoPersona.insertId,
            nombre_usuario,
            passwordEncriptada,
            id_rol_sistema || 6
        ]
    );

    // Si es paciente, también lo agregamos en la tabla de pacientes
    if (resultadoUsuario.affectedRows === 1) {
        await execute(
            `INSERT INTO pacientes (id_persona) VALUES (?)`,
            [resultadoPersona.insertId]
        );

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente'
        });
    } else {
        res.status(400);
        throw new Error('Error al registrar el usuario');
    }
});

/* ---------------------------------------------------
   👤 PERFIL DEL USUARIO LOGUEADO
--------------------------------------------------- */
const obtenerPerfil = asyncHandler(async (req, res) => {
    const resultado = await execute(
        `
        SELECT id_usuario, nombre, apellido, dni, fecha_nacimiento, genero, 
               email, telefono, nombre_usuario, id_rol_sistema 
        FROM usuarios 
        WHERE id_usuario = ?
        `,
        [req.user.id]
    );

    if (resultado.length === 0) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    res.json(resultado[0]);
});

/* ---------------------------------------------------
   Exportamos las funciones para usarlas en las rutas
--------------------------------------------------- */
module.exports = {
    iniciarSesion,
    registrarUsuario,
    obtenerPerfil
};
