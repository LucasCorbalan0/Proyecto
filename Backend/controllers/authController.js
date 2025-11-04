// Archivo: authController.js

// 1. Importamos las dependencias necesarias
// ASUME que 'db.js' se encuentra en './db' o ajusta la ruta según tu estructura.
const pool = require('../config/database'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ---
// 2. FUNCIÓN DE REGISTRO (Registro de nuevos pacientes)
// ---
const register = async (req, res) => {
    // Obtenemos todos los campos del formulario
    const { 
        nombre, 
        apellido, 
        dni, 
        fecha_nacimiento, 
        email, 
        telefono, 
        nombre_usuario, 
        password 
    } = req.body;

    // Rol 6: Paciente (Según la lógica de tu profesor)
    const ID_ROL_PACIENTE = 6; 

    // Validación de datos obligatorios
    if (!nombre || !apellido || !dni || !fecha_nacimiento || !email || !nombre_usuario || !password) {
        return res.status(400).json({ message: "Faltan datos obligatorios para el registro." });
    }

    let connection;
    try {
        // 1. Encriptamos la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Iniciamos la conexión y la transacción (clave para operaciones multi-tabla)
        connection = await pool.getConnection(); 
        await connection.beginTransaction();

        // 3. Insertamos en la tabla PERSONAS
        const [personaResult] = await connection.query(
            "INSERT INTO personas (dni, nombre, apellido, fecha_nacimiento, email, telefono) VALUES (?, ?, ?, ?, ?, ?)",
            [dni, nombre, apellido, fecha_nacimiento, email, telefono || null]
        );
        const id_persona = personaResult.insertId;

        // 4. Insertamos en la tabla USUARIOS
        await connection.query(
            "INSERT INTO usuarios (nombre_usuario, password, id_persona, id_rol_sistema, activo) VALUES (?, ?, ?, ?, 1)",
            [nombre_usuario, hashedPassword, id_persona, ID_ROL_PACIENTE]
        );
        
        // 5. Insertamos en la tabla PACIENTES
        const [pacienteResult] = await connection.query(
            "INSERT INTO pacientes (id_persona) VALUES (?)", 
            [id_persona]
        );
        const id_paciente = pacienteResult.insertId;

        // 6. Creamos la HISTORIA CLÍNICA vacía para mantener la integridad (referencia a id_paciente)
        await connection.query(
            "INSERT INTO historiasclinicas (id_paciente, fecha_creacion) VALUES (?, CURDATE())", 
            [id_paciente]
        );

        // 7. Confirmamos todos los cambios en la base de datos
        await connection.commit();

        res.status(201).json({ message: "¡Usuario registrado exitosamente! Ya podés iniciar sesión." });

    } catch (error) {
        // 8. Si algo falló, revertimos la transacción
        if (connection) await connection.rollback();
        console.error(error);
        
        // Manejo de errores de duplicidad (DNI, email o nombre de usuario únicos)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Error: El DNI, email o nombre de usuario ya existe en el sistema." });
        }
        
        res.status(500).json({ message: "Error en el servidor al registrar usuario", error: error.message });
    } finally {
        // 9. Devolvemos la conexión al pool
        if (connection) connection.release();
    }
};

// ---
// 3. FUNCIÓN DE LOGIN (Inicio de sesión)
// ---
const login = async (req, res) => {
    const { nombre_usuario, password } = req.body;

    try {
        // 1. Buscar al usuario y traer su rol (promise-based pool.query)
        const [rows] = await pool.query( 
            `SELECT 
                u.id_usuario, u.password, u.id_persona,
                r.nombre as rolName 
            FROM usuarios u
            JOIN rolessistema r ON u.id_rol_sistema = r.id_rol_sistema
            WHERE u.nombre_usuario = ? AND u.activo = 1`,
            [nombre_usuario]
        );

        const usuario = rows[0];
        if (!usuario) {
            return res.status(401).json({ message: "Credenciales incorrectas (Usuario no encontrado o inactivo)" });
        }

        // 2. Comparar la contraseña encriptada
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // 3. Crear el Token JWT
        const payload = {
            id_usuario: usuario.id_usuario,
            id_persona: usuario.id_persona,
            rol: usuario.rolName // ej: "PACIENTE"
        };
        
        // **IMPORTANTE**: Asume que process.env.JWT_SECRET está configurado
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'SECRET_DEV', // Usar un valor por defecto solo para desarrollo
            { expiresIn: '1d' } 
        );

        // 4. Enviar el token y los datos del usuario
        res.json({
            message: "Login exitoso",
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                id_persona: usuario.id_persona,
                rol: usuario.rolName
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor al iniciar sesión", error: error.message });
    }
};

// ---
// 4. FUNCIÓN DE PROFILE (Obtener datos personales del usuario logueado)
// ---
const profile = async (req, res) => {
    // req.user es el payload del JWT decodificado (id_persona y rol)
    const { id_persona, rol } = req.user; 

    try {
        // Obtenemos los datos de la tabla personas
        const [rows] = await pool.query( 
            "SELECT nombre, apellido, email, dni, telefono FROM personas WHERE id_persona = ?", 
            [id_persona]
        );

        if(rows.length === 0) {
            return res.status(404).json({ message: "Datos de persona no encontrados" });
        }

        // Devolvemos la información junto con el rol
        res.json({
            ...rows[0],
            rol: rol
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
    }
};

// ---
// 5. BLOQUE DE EXPORTACIÓN
// ---
module.exports = {
    register,
    login,
    profile
};