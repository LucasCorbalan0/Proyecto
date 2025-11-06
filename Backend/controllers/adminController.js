// Archivo: Backend/controllers/adminController.js
const asyncHandler = require('express-async-handler');
const { execute, pool } = require('../config/database'); 
const bcrypt = require('bcryptjs');

// 🔹 Helper para obtener el ID del rol por su nombre
const getRoleIdByName = async (roleName) => {
    const [roles] = await execute('SELECT id_rol_sistema FROM rolessistema WHERE nombre = ?', [roleName]);
    return roles.length > 0 ? roles[0].id_rol_sistema : null;
};

// 🔹 [GET] Obtener todos los usuarios del sistema
const getUsers = asyncHandler(async (req, res) => {
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

    // ✅ CORRECCIÓN: execute() ya devuelve las filas, no hace falta desestructurar
    const users = await execute(query);

    const formattedUsers = users.map(user => ({
        ...user,
        nombre: `${user.nombre_persona} ${user.apellido_persona}`,
        activo: user.activo === 1,
        fechaNacimiento: user.fecha_nacimiento 
            ? new Date(user.fecha_nacimiento).toISOString().split('T')[0] 
            : '',
    }));

    res.json(formattedUsers);
});

// 🔹 [POST] Crear un nuevo usuario
const createUser = asyncHandler(async (req, res) => {
    const { nombre, apellido, dni, email, fechaNacimiento, telefono, username, rol } = req.body;

    if (!nombre || !apellido || !dni || !email || !username || !rol) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos requeridos.' });
    }

    let connection;
    try {
        connection = await pool.getConnection(); 
        await connection.beginTransaction();

        const id_rol_sistema = await getRoleIdByName(rol);
        if (!id_rol_sistema) throw new Error(`Rol "${rol}" no encontrado.`);

        const password = dni.toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 1️⃣ Insertar en personas
        const [personResult] = await connection.execute(
            `INSERT INTO personas (nombre, apellido, dni, email, fecha_nacimiento, telefono) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, dni, email, fechaNacimiento, telefono]
        );
        const id_persona = personResult.insertId;

        // 2️⃣ Insertar en usuarios
        const [userResult] = await connection.execute(
            `INSERT INTO usuarios (nombre_usuario, password, id_persona, id_rol_sistema, activo) 
             VALUES (?, ?, ?, ?, 1)`,
            [username, hashedPassword, id_persona, id_rol_sistema]
        );
        const id_usuario = userResult.insertId;

        // 3️⃣ Si el rol es paciente, insertar en sus tablas correspondientes
        if (id_rol_sistema === 6) {
            const [pacienteResult] = await connection.execute(
                'INSERT INTO pacientes (id_persona) VALUES (?)', 
                [id_persona]
            );
            await connection.execute(
                'INSERT INTO historiasclinicas (id_paciente, fecha_creacion) VALUES (?, CURDATE())',
                [pacienteResult.insertId]
            );
        }

        await connection.commit();
        res.status(201).json({ message: `Usuario ${nombre} ${apellido} creado exitosamente.` });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error en la creación de usuario:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Ya existe un usuario con ese DNI, Email o Nombre de Usuario.' });
        } else {
            res.status(500).json({ message: 'Error en el servidor al crear el usuario.', error: error.message });
        }
    } finally {
        if (connection) connection.release();
    }
});

// 🔹 [PUT] Actualizar un usuario existente
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { nombre, apellido, dni, email, fechaNacimiento, telefono, username, rol } = req.body;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const id_rol_sistema = await getRoleIdByName(rol);

        // Obtener id_persona
        const [userCheck] = await connection.execute(
            'SELECT id_persona FROM usuarios WHERE id_usuario = ?', 
            [id]
        );
        if (userCheck.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const id_persona = userCheck[0].id_persona;

        // Actualizar personas
        await connection.execute(
            `UPDATE personas 
             SET nombre = ?, apellido = ?, dni = ?, email = ?, fecha_nacimiento = ?, telefono = ? 
             WHERE id_persona = ?`,
            [nombre, apellido, dni, email, fechaNacimiento, telefono, id_persona]
        );

        // Actualizar usuarios
        await connection.execute(
            `UPDATE usuarios 
             SET nombre_usuario = ?, id_rol_sistema = ? 
             WHERE id_usuario = ?`,
            [username, id_rol_sistema, id]
        );
        
        await connection.commit();
        res.json({ message: `Usuario ID ${id} actualizado exitosamente.` });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error en la actualización de usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Ya existe un DNI, Email o Nombre de Usuario con ese valor.' });
        } else {
            res.status(500).json({ message: 'Error en el servidor al actualizar el usuario.', error: error.message });
        }
    } finally {
        if (connection) connection.release();
    }
});

// 🔹 [PUT] Alternar estado activo/inactivo
const toggleActiveUser = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const [user] = await execute('SELECT activo FROM usuarios WHERE id_usuario = ?', [id]);

    if (user.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const newStatus = user[0].activo === 1 ? 0 : 1; 
    await execute('UPDATE usuarios SET activo = ? WHERE id_usuario = ?', [newStatus, id]);
    
    res.json({ 
        message: `Estado de usuario ID ${id} actualizado a ${newStatus === 1 ? 'Activo' : 'Desactivado'}.`,
        newStatus: newStatus === 1 
    });
});

// 🔹 [DELETE] Eliminar un usuario
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const [deleteResult] = await execute('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

    if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
    }

    res.json({ message: `Usuario ID ${id} eliminado exitosamente.` });
});

module.exports = {
    getUsers,
    createUser,
    updateUser,
    toggleActiveUser,
    deleteUser,
};
