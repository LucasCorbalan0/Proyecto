// Archivo: Backend/controllers/pacienteController.js

const asyncHandler = require('express-async-handler');
const { execute } = require('../config/database');

// Panel principal del paciente
const obtenerDashboardPaciente = asyncHandler(async (req, res) => {
    const { id_paciente } = req.params;

    const [pacienteRows] = await execute(`
        SELECT p.nombre, p.apellido, p.dni, p.email
        FROM pacientes pac
        JOIN personas p ON p.id_persona = pac.id_persona
        WHERE pac.id_paciente = ?
    `, [id_paciente]);

    if (pacienteRows.length === 0) {
        res.status(404);
        throw new Error('Paciente no encontrado');
    }

    // Próximos turnos
    const [turnosRows] = await execute(`
        SELECT t.*, p.nombre as nombre_medico, p.apellido as apellido_medico, e.nombre as especialidad
        FROM turnos t
        JOIN medicos m ON m.id_medico = t.id_medico
        JOIN personas p ON p.id_persona = m.id_persona
        JOIN especialidades e ON e.id_especialidad = m.id_especialidad
        WHERE t.id_paciente = ?
        AND t.fecha >= CURDATE()
        AND t.estado = 'Reservado'
        ORDER BY t.fecha, t.hora_inicio
        LIMIT 5
    `, [id_paciente]);

    // Últimos estudios médicos
    const [estudiosRows] = await execute(`
        SELECT em.*, p.nombre as nombre_medico, p.apellido as apellido_medico
        FROM estudios_medicos em
        JOIN medicos m ON m.id_medico = em.id_medico
        JOIN personas p ON p.id_persona = m.id_persona
        WHERE em.id_paciente = ?
        AND em.estado = 'Completado'
        ORDER BY em.fecha_resultado DESC
        LIMIT 5
    `, [id_paciente]);

    // Recetas próximas a vencer
    const [recetasRows] = await execute(`
        SELECT r.*, m.nombre as medicamento,
               p.nombre as nombre_medico, p.apellido as apellido_medico
        FROM recetas r
        JOIN medicamentos m ON m.id_medicamento = r.id_medicamento
        JOIN medicos med ON med.id_medico = r.id_medico
        JOIN personas p ON p.id_persona = med.id_persona
        WHERE r.id_paciente = ?
        AND r.fecha_vencimiento >= CURDATE()
        ORDER BY r.fecha_vencimiento
        LIMIT 5
    `, [id_paciente]);

    res.json({
        status: 'success',
        data: {
            paciente: pacienteRows[0],
            proximosTurnos: turnosRows,
            ultimosEstudios: estudiosRows,
            recetasProximasVencer: recetasRows
        }
    });
});

// Listado de recetas del paciente
const obtenerRecetasPaciente = asyncHandler(async (req, res) => {
    const { id_paciente } = req.params;

    const [recetas] = await execute(`
        SELECT r.*, m.nombre as medicamento,
               p.nombre as nombre_medico, p.apellido as apellido_medico
        FROM recetas r
        JOIN medicamentos m ON m.id_medicamento = r.id_medicamento
        JOIN medicos med ON med.id_medico = r.id_medico
        JOIN personas p ON p.id_persona = med.id_persona
        WHERE r.id_paciente = ?
        ORDER BY r.fecha_vencimiento DESC
    `, [id_paciente]);

    res.json({
        status: 'success',
        data: recetas
    });
});

// Listado de estudios médicos
const obtenerEstudiosPaciente = asyncHandler(async (req, res) => {
    const { id_paciente } = req.params;

    const [estudios] = await execute(`
        SELECT em.*, p.nombre as nombre_medico, p.apellido as apellido_medico
        FROM estudios_medicos em
        JOIN medicos m ON m.id_medico = em.id_medico
        JOIN personas p ON p.id_persona = m.id_persona
        WHERE em.id_paciente = ?
        ORDER BY em.fecha_resultado DESC
    `, [id_paciente]);

    res.json({
        status: 'success',
        data: estudios
    });
});

// Listado de turnos del paciente
const obtenerTurnosPaciente = asyncHandler(async (req, res) => {
    const { id_paciente } = req.params;

    const [turnos] = await execute(`
        SELECT t.*, p.nombre as nombre_medico, p.apellido as apellido_medico,
               e.nombre as especialidad
        FROM turnos t
        JOIN medicos m ON m.id_medico = t.id_medico
        JOIN personas p ON p.id_persona = m.id_persona
        JOIN especialidades e ON e.id_especialidad = m.id_especialidad
        WHERE t.id_paciente = ?
        ORDER BY t.fecha DESC, t.hora_inicio DESC
    `, [id_paciente]);

    res.json({
        status: 'success',
        data: turnos
    });
});

// Cancelar un turno
const cancelarTurnoPaciente = asyncHandler(async (req, res) => {
    const { id_turno } = req.params;

    await execute(`
        UPDATE turnos 
        SET estado = 'Cancelado'
        WHERE id_turno = ?
    `, [id_turno]);

    res.json({
        status: 'success',
        message: 'Turno cancelado correctamente'
    });
});

module.exports = {
    obtenerDashboardPaciente,
    obtenerRecetasPaciente,
    obtenerEstudiosPaciente,
    obtenerTurnosPaciente,
    cancelarTurnoPaciente
};
