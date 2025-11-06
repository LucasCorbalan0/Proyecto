// Archivo: Backend/controllers/adminController.js

const asyncHandler = require('express-async-handler');
const { execute, pool } = require('../config/database');
const bcrypt = require('bcryptjs');

/* ---------------------------------------------------
   Función auxiliar: obtener el ID de un rol 
   según su nombre.
--------------------------------------------------- */
const obtenerIdRolPorNombre = async (nombreRol) => {
    const [roles] = await execute('SELECT id_rol_sistema FROM rolessistema WHERE nombre = ?', [nombreRol]);
    return roles.length > 0 ? roles[0].id_rol_sistema : null;
};

/* ---------------------------------------------------
   GET - Obtener todos los usuarios del sistema
--------------------------------------------------- */
const obtenerUsuarios = asyncHandler(async (req, res) => {
    const query = `
        SELECT
            u.id_usuario AS id,
            u.nombre_usuario AS username,
            u.activo,
            p.nombre AS nombre_persona,
            p.apellido AS apellido_persona,
            p.dni,
            p.email,
            p.telefono,
            p.fecha_nacimiento,
            r.nombre AS rol
        FROM
            usuarios u
        JOIN
            personas p ON u.id_persona = p.id_persona
        JOIN
            rolessistema r ON u.id_rol_sistema = r.id_rol_sistema
        ORDER BY 
            u.id_usuario DESC
    `;

    const usuarios = await execute(query);

    const usuariosFormateados = usuarios.map(usuario => ({
        ...usuario,
        nombre: `${usuario.nombre_persona} ${usuario.apellido_persona}`,
        activo: usuario.activo === 1,
        fechaNacimiento: usuario.fecha_nacimiento 
            ? new Date(usuario.fecha_nacimiento).toISOString().split('T')[0] 
            : '',
    }));

    res.json(usuariosFormateados);
});

/* ---------------------------------------------------
   POST - Crear un nuevo usuario
--------------------------------------------------- */
const crearUsuario = asyncHandler(async (req, res) => {
    const { nombre, apellido, dni, email, fechaNacimiento, telefono, username, rol } = req.body;

    if (!nombre || !apellido || !dni || !email || !username || !rol) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos requeridos.' });
    }

    let conexion;
    try {
        conexion = await pool.getConnection(); 
        await conexion.beginTransaction();

        const id_rol_sistema = await obtenerIdRolPorNombre(rol);
        if (!id_rol_sistema) throw new Error(`Rol "${rol}" no encontrado.`);

        const password = dni.toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 1. Insertar en personas
        const [personaResultado] = await conexion.execute(
            `INSERT INTO personas (nombre, apellido, dni, email, fecha_nacimiento, telefono) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, dni, email, fechaNacimiento, telefono]
        );
        const id_persona = personaResultado.insertId;

        // 2. Insertar en usuarios
        const [usuarioResultado] = await conexion.execute(
            `INSERT INTO usuarios (nombre_usuario, password, id_persona, id_rol_sistema, activo) 
             VALUES (?, ?, ?, ?, 1)`,
            [username, hashedPassword, id_persona, id_rol_sistema]
        );
        const id_usuario = usuarioResultado.insertId;

        // 3. Si el rol es paciente, insertar registros adicionales
        if (id_rol_sistema === 6) {
            const [pacienteResultado] = await conexion.execute(
                'INSERT INTO pacientes (id_persona) VALUES (?)', 
                [id_persona]
            );
            await conexion.execute(
                'INSERT INTO historiasclinicas (id_paciente, fecha_creacion) VALUES (?, CURDATE())',
                [pacienteResultado.insertId]
            );
        }

        await conexion.commit();
        res.status(201).json({ message: `Usuario ${nombre} ${apellido} creado exitosamente.` });

    } catch (error) {
        if (conexion) await conexion.rollback();
        console.error('Error al crear el usuario:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Ya existe un usuario con ese DNI, Email o Nombre de Usuario.' });
        } else {
            res.status(500).json({ message: 'Error en el servidor al crear el usuario.', error: error.message });
        }
    } finally {
        if (conexion) conexion.release();
    }
});

/* ---------------------------------------------------
   PUT - Actualizar un usuario existente
--------------------------------------------------- */
const actualizarUsuario = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { nombre, apellido, dni, email, fechaNacimiento, telefono, username, rol } = req.body;

    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();
        
        const id_rol_sistema = await obtenerIdRolPorNombre(rol);

        // Verificar si el usuario existe
        const [usuarioVerificado] = await conexion.execute(
            'SELECT id_persona FROM usuarios WHERE id_usuario = ?', 
            [id]
        );
        if (usuarioVerificado.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const id_persona = usuarioVerificado[0].id_persona;

        // Actualizar datos personales
        await conexion.execute(
            `UPDATE personas 
             SET nombre = ?, apellido = ?, dni = ?, email = ?, fecha_nacimiento = ?, telefono = ? 
             WHERE id_persona = ?`,
            [nombre, apellido, dni, email, fechaNacimiento, telefono, id_persona]
        );

        // Actualizar usuario
        await conexion.execute(
            `UPDATE usuarios 
             SET nombre_usuario = ?, id_rol_sistema = ? 
             WHERE id_usuario = ?`,
            [username, id_rol_sistema, id]
        );
        
        await conexion.commit();
        res.json({ message: `Usuario ID ${id} actualizado exitosamente.` });

    } catch (error) {
        if (conexion) await conexion.rollback();
        console.error('Error al actualizar el usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Ya existe un DNI, Email o Nombre de Usuario con ese valor.' });
        } else {
            res.status(500).json({ message: 'Error en el servidor al actualizar el usuario.', error: error.message });
        }
    } finally {
        if (conexion) conexion.release();
    }
});

/* ---------------------------------------------------
   PUT - Cambiar el estado activo/inactivo de un usuario
--------------------------------------------------- */
const cambiarEstadoUsuario = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const [usuario] = await execute('SELECT activo FROM usuarios WHERE id_usuario = ?', [id]);

    if (usuario.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const nuevoEstado = usuario[0].activo === 1 ? 0 : 1; 
    await execute('UPDATE usuarios SET activo = ? WHERE id_usuario = ?', [nuevoEstado, id]);
    
    res.json({ 
        message: `Estado del usuario ID ${id} actualizado a ${nuevoEstado === 1 ? 'Activo' : 'Desactivado'}.`,
        nuevoEstado: nuevoEstado === 1 
    });
});

/* ---------------------------------------------------
   DELETE - Eliminar un usuario del sistema
--------------------------------------------------- */
const eliminarUsuario = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const [resultadoEliminacion] = await execute('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

    if (resultadoEliminacion.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
    }

    res.json({ message: `Usuario ID ${id} eliminado exitosamente.` });
});

/* ---------------------------------------------------
   Exportar controladores
--------------------------------------------------- */
module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario,
};
