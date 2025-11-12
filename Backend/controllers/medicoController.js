const asyncHandler = require('express-async-handler');
const { execute } = require('../config/database');


const obtenerMedicos = asyncHandler(async (req, res) => {
    const medicos = await execute(`
        SELECT 
            m.id_medico,
            m.matricula,
            p.id_persona,
            p.nombre,
            p.apellido,
            p.email,
            p.telefono,
            p.dni,
            e.id_especialidad,
            e.nombre as especialidad
        FROM medicos m
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        ORDER BY p.apellido, p.nombre
    `);

    res.json({
        success: true,
        total: medicos.length,
        data: medicos
    });
});

const obtenerMedicoPorId = asyncHandler(async (req, res) => {
    const { id_medico } = req.params;

    const medico = await execute(`
        SELECT 
            m.id_medico,
            m.matricula,
            p.id_persona,
            p.nombre,
            p.apellido,
            p.email,
            p.telefono,
            p.dni,
            e.id_especialidad,
            e.nombre as especialidad
        FROM medicos m
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE m.id_medico = ?
    `, [id_medico]);

    if (medico.length === 0) {
        res.status(404);
        throw new Error('Médico no encontrado');
    }

    res.json({
        success: true,
        data: medico[0]
    });
});


const crearMedico = asyncHandler(async (req, res) => {
    const { nombre, apellido, dni, email, telefono, matricula, id_especialidad, fecha_nacimiento } = req.body;

    if (!nombre || !apellido || !dni || !matricula || !id_especialidad) {
        res.status(400);
        throw new Error('Por favor complete todos los campos requeridos');
    }

    // Verificar si ya existen
    const datosExistentes = await execute(`
        SELECT p.dni, p.email, m.matricula
        FROM medicos m
        LEFT JOIN personas p ON m.id_persona = p.id_persona
        WHERE p.dni = ? OR p.email = ? OR m.matricula = ?
    `, [dni, email || null, matricula]);

    if (datosExistentes.length > 0) {
        res.status(400);
        if (datosExistentes[0].dni === dni) {
            throw new Error('El DNI ya está registrado');
        } else if (datosExistentes[0].email === email) {
            throw new Error('El email ya está registrado');
        } else {
            throw new Error('La matrícula ya está registrada');
        }
    }

    // Insertar persona
    const resultadoPersona = await execute(`
        INSERT INTO personas (nombre, apellido, dni, email, telefono, fecha_nacimiento)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [nombre, apellido, dni, email || null, telefono || null, fecha_nacimiento || null]);

    // Insertar médico
    const resultadoMedico = await execute(`
        INSERT INTO medicos (id_persona, matricula, id_especialidad)
        VALUES (?, ?, ?)
    `, [resultadoPersona.insertId, matricula, id_especialidad]);

    res.status(201).json({
        success: true,
        mensaje: 'Médico creado exitosamente',
        id_medico: resultadoMedico.insertId
    });
});


const actualizarMedico = asyncHandler(async (req, res) => {
    const { id_medico } = req.params;
    const datosActualizados = req.body;

    // Verificar que el médico existe
    const medicoExiste = await execute(
        'SELECT id_persona FROM medicos WHERE id_medico = ?',
        [id_medico]
    );

    if (medicoExiste.length === 0) {
        res.status(404);
        throw new Error('Médico no encontrado');
    }

    const id_persona = medicoExiste[0].id_persona;

    // Actualizar datos de persona si se proporcionan
    if (datosActualizados.nombre || datosActualizados.apellido || datosActualizados.email || 
        datosActualizados.telefono) {
        
        await execute(`
            UPDATE personas 
            SET 
                nombre = COALESCE(?, nombre),
                apellido = COALESCE(?, apellido),
                email = COALESCE(?, email),
                telefono = COALESCE(?, telefono)
            WHERE id_persona = ?
        `, [
            datosActualizados.nombre || null,
            datosActualizados.apellido || null,
            datosActualizados.email || null,
            datosActualizados.telefono || null,
            id_persona
        ]);
    }

    // Actualizar datos de médico si se proporcionan
    if (datosActualizados.matricula || datosActualizados.id_especialidad) {
        await execute(`
            UPDATE medicos 
            SET 
                matricula = COALESCE(?, matricula),
                id_especialidad = COALESCE(?, id_especialidad)
            WHERE id_medico = ?
        `, [
            datosActualizados.matricula || null,
            datosActualizados.id_especialidad || null,
            id_medico
        ]);
    }

    res.json({
        success: true,
        mensaje: 'Médico actualizado exitosamente'
    });
});


const eliminarMedico = asyncHandler(async (req, res) => {
    const { id_medico } = req.params;

    const medicoExiste = await execute(
        'SELECT id_persona FROM medicos WHERE id_medico = ?',
        [id_medico]
    );

    if (medicoExiste.length === 0) {
        res.status(404);
        throw new Error('Médico no encontrado');
    }

    const id_persona = medicoExiste[0].id_persona;

    // Eliminar médico
    await execute('DELETE FROM medicos WHERE id_medico = ?', [id_medico]);

    // Eliminar persona
    await execute('DELETE FROM personas WHERE id_persona = ?', [id_persona]);

    res.json({
        success: true,
        mensaje: 'Médico eliminado exitosamente'
    });
});


const obtenerDisponibilidad = asyncHandler(async (req, res) => {
    const { id_medico } = req.params;
    const { fecha } = req.query;

    let query = `
        SELECT 
            id_disponibilidad,
            id_medico,
            fecha,
            hora_inicio,
            hora_fin
        FROM disponibilidad_medicos
        WHERE id_medico = ?
    `;
    const params = [id_medico];

    if (fecha) {
        query += ' AND fecha = ?';
        params.push(fecha);
    }

    query += ' ORDER BY fecha, hora_inicio';

    const disponibilidad = await execute(query, params);

    res.json({
        success: true,
        data: disponibilidad
    });
});


const agregarDisponibilidad = asyncHandler(async (req, res) => {
    const { id_medico } = req.params;
    const { fecha, hora_inicio, hora_fin } = req.body;

    if (!fecha || !hora_inicio || !hora_fin) {
        res.status(400);
        throw new Error('Por favor complete todos los campos');
    }

    const resultado = await execute(`
        INSERT INTO disponibilidad_medicos (id_medico, fecha, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?)
    `, [id_medico, fecha, hora_inicio, hora_fin]);

    res.status(201).json({
        success: true,
        mensaje: 'Disponibilidad agregada exitosamente',
        id_disponibilidad: resultado.insertId
    });
});


const eliminarDisponibilidad = asyncHandler(async (req, res) => {
    const { id_disponibilidad } = req.params;

    const resultado = await execute(
        'DELETE FROM disponibilidad_medicos WHERE id_disponibilidad = ?',
        [id_disponibilidad]
    );

    if (resultado.affectedRows === 0) {
        res.status(404);
        throw new Error('Disponibilidad no encontrada');
    }

    res.json({
        success: true,
        mensaje: 'Disponibilidad eliminada exitosamente'
    });
});


module.exports = {
    obtenerMedicos,
    obtenerMedicoPorId,
    crearMedico,
    actualizarMedico,
    eliminarMedico,
    obtenerDisponibilidad,
    agregarDisponibilidad,
    eliminarDisponibilidad
};
