const asyncHandler = require('express-async-handler');
const { execute } = require('../config/database');
const bcrypt = require('bcryptjs');

// Usamos asynchandler para manejar errores de forma automatica
const obtenerUsuarios = asyncHandler(async (req, res) => {
    const usuarios = await execute(`
        SELECT
            u.id_usuario,
            u.nombre_usuario,
            u.activo,
            p.nombre,
            p.apellido,
            p.dni,
            p.email,
            p.telefono,
            p.fecha_nacimiento,
            p.genero,
            p.direccion,
            r.nombre as rol
        FROM
            usuarios u
        JOIN
            personas p ON u.id_persona = p.id_persona
        JOIN
            rolessistema r ON u.id_rol_sistema = r.id_rol_sistema
        ORDER BY 
            u.id_usuario DESC
    `);

    res.json({
        success: true,
        total: usuarios.length,
        data: usuarios
    });
});


const crearUsuario = asyncHandler(async (req, res) => {
    const { nombre, apellido, dni, email, fecha_nacimiento, telefono, nombre_usuario, password, id_rol_sistema, genero, direccion } = req.body;

    //Validar datos
    if (!nombre || !apellido || !dni || !nombre_usuario || !password || !id_rol_sistema) {
        res.status(400);
        throw new Error('Por favor complete todos los campos requeridos');
    }

    // Verificar si ya existen
    const datosExistentes = await execute(`
        SELECT u.nombre_usuario, p.dni, p.email
        FROM usuarios u
        LEFT JOIN personas p ON p.id_persona = u.id_persona
        WHERE u.nombre_usuario = ? OR p.dni = ? OR (p.email = ? AND p.email IS NOT NULL)
    `, [nombre_usuario, dni, email || null]);

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

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Insertar persona
    const resultadoPersona = await execute(`
        INSERT INTO personas (
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            email,
            telefono,
            genero,
            direccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        nombre,
        apellido,
        dni,
        fecha_nacimiento || null,
        email || null,
        telefono || null,
        genero || null,
        direccion || null
    ]);

    // Insertar usuario
    const resultadoUsuario = await execute(`
        INSERT INTO usuarios (
            id_persona,
            nombre_usuario,
            password,
            id_rol_sistema
        ) VALUES (?, ?, ?, ?)
    `, [
        resultadoPersona.insertId,
        nombre_usuario,
        passwordEncriptada,
        id_rol_sistema
    ]);

    res.status(201).json({
        success: true,
        mensaje: 'Usuario creado exitosamente',
        id_usuario: resultadoUsuario.insertId
    });
});


const actualizarUsuario = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const datosActualizados = req.body;

    // Verificar si el usuario existe
    const usuarioExiste = await execute(
        'SELECT id_persona FROM usuarios WHERE id_usuario = ?', 
        [id]
    );

    if (usuarioExiste.length === 0) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    const id_persona = usuarioExiste[0].id_persona;

    // Actualizar datos personales
    if (datosActualizados.nombre || datosActualizados.apellido || datosActualizados.email || 
        datosActualizados.telefono || datosActualizados.genero || datosActualizados.direccion) {
        
        await execute(`
            UPDATE personas 
            SET 
                nombre = COALESCE(?, nombre),
                apellido = COALESCE(?, apellido),
                email = COALESCE(?, email),
                telefono = COALESCE(?, telefono),
                genero = COALESCE(?, genero),
                direccion = COALESCE(?, direccion)
            WHERE id_persona = ?
        `, [
            datosActualizados.nombre || null,
            datosActualizados.apellido || null,
            datosActualizados.email || null,
            datosActualizados.telefono || null,
            datosActualizados.genero || null,
            datosActualizados.direccion || null,
            id_persona
        ]);
    }

    // Actualizar datos de usuario
    if (datosActualizados.nombre_usuario || datosActualizados.id_rol_sistema) {
        await execute(`
            UPDATE usuarios 
            SET 
                nombre_usuario = COALESCE(?, nombre_usuario),
                id_rol_sistema = COALESCE(?, id_rol_sistema)
            WHERE id_usuario = ?
        `, [
            datosActualizados.nombre_usuario || null,
            datosActualizados.id_rol_sistema || null,
            id
        ]);
    }

    res.json({
        success: true,
        mensaje: 'Usuario actualizado exitosamente'
    });
});


const cambiarEstadoUsuario = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const usuario = await execute('SELECT activo FROM usuarios WHERE id_usuario = ?', [id]);

    if (usuario.length === 0) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    const nuevoEstado = usuario[0].activo === 1 ? 0 : 1; 
    await execute('UPDATE usuarios SET activo = ? WHERE id_usuario = ?', [nuevoEstado, id]);
    
    res.json({ 
        success: true,
        mensaje: `Estado del usuario actualizado a ${nuevoEstado === 1 ? 'Activo' : 'Desactivado'}`,
        nuevoEstado: nuevoEstado === 1 
    });
});


const eliminarUsuario = asyncHandler(async (req, res) => {
    const { id } = req.params; 

    // Obtener id_persona del usuario
    const usuario = await execute('SELECT id_persona FROM usuarios WHERE id_usuario = ?', [id]);

    if (usuario.length === 0) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    const id_persona = usuario[0].id_persona;

    // Eliminar usuario
    await execute('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

    // Eliminar persona
    await execute('DELETE FROM personas WHERE id_persona = ?', [id_persona]);

    res.json({ 
        success: true,
        mensaje: 'Usuario eliminado exitosamente'
    });
});


module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario,
};
