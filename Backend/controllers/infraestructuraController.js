// Backend/controllers/infraestructuraController.js
const asyncHandler = require('express-async-handler');
const { execute } = require('../config/database');

// Obtener todas las habitaciones con sus camas
const obtenerInfraestructura = asyncHandler(async (req, res) => {
    const habitaciones = await execute(`
        SELECT
            h.id_habitacion,
            h.numero_habitacion,
            h.tipo_habitacion,
            COUNT(c.id_cama) AS total_camas,
            IFNULL(SUM(CASE WHEN c.estado = 'Ocupada' THEN 1 ELSE 0 END), 0) AS camas_ocupadas
        FROM habitaciones h
        LEFT JOIN camas c ON h.id_habitacion = c.id_habitacion
        GROUP BY h.id_habitacion, h.numero_habitacion, h.tipo_habitacion
        ORDER BY h.numero_habitacion ASC
    `);

    res.status(200).json({
        success: true,
        data: habitaciones
    });
});

// Crear una nueva habitación
const crearInfraestructura = asyncHandler(async (req, res) => {
    const { numero_habitacion, tipo_habitacion, cantidad_camas } = req.body;

    if (!numero_habitacion || !tipo_habitacion) {
        res.status(400);
        throw new Error('Faltan datos: número o tipo de habitación');
    }

    // Insertar habitación
    const resultadoHabitacion = await execute(
        "INSERT INTO habitaciones (numero_habitacion, tipo_habitacion) VALUES (?, ?)",
        [numero_habitacion, tipo_habitacion]
    );

    const id_habitacion = resultadoHabitacion.insertId;
    const numCamas = parseInt(cantidad_camas, 10) || 1;

    // Crear camas
    if (numCamas > 0) {
        for (let i = 1; i <= numCamas; i++) {
            const numero_cama = String.fromCharCode(64 + i); // A, B, C...
            await execute(
                "INSERT INTO camas (id_habitacion, numero_cama, estado) VALUES (?, ?, ?)",
                [id_habitacion, numero_cama, 'Disponible']
            );
        }
    }

    res.status(201).json({
        success: true,
        id_habitacion,
        numero_habitacion,
        tipo_habitacion,
        cantidad_camas: numCamas,
        mensaje: `Habitación ${numero_habitacion} creada correctamente`
    });
});

// Actualizar una habitación
const actualizarInfraestructura = asyncHandler(async (req, res) => {
    const id_habitacion = req.params.id;
    const { tipo_habitacion } = req.body;

    if (!tipo_habitacion) {
        res.status(400);
        throw new Error('El tipo de habitación es obligatorio');
    }

    const resultado = await execute(
        "UPDATE habitaciones SET tipo_habitacion = ? WHERE id_habitacion = ?",
        [tipo_habitacion, id_habitacion]
    );

    if (resultado.affectedRows === 0) {
        res.status(404);
        throw new Error('Habitación no encontrada');
    }

    res.json({
        success: true,
        id_habitacion: parseInt(id_habitacion, 10),
        mensaje: 'Habitación actualizada correctamente'
    });
});

// Eliminar una habitación
const eliminarInfraestructura = asyncHandler(async (req, res) => {
    const id_habitacion = req.params.id;

    const resultado = await execute(
        "DELETE FROM habitaciones WHERE id_habitacion = ?",
        [id_habitacion]
    );

    if (resultado.affectedRows === 0) {
        res.status(404);
        throw new Error('Habitación no encontrada');
    }

    res.json({
        success: true,
        id_habitacion: parseInt(id_habitacion, 10),
        mensaje: 'Habitación eliminada correctamente'
    });
});

// Marcar una cama como ocupada
const ocuparCama = asyncHandler(async (req, res) => {
    const id_habitacion = req.params.habitacionId;

    const camaDisponible = await execute(
        "SELECT id_cama, numero_cama FROM camas WHERE id_habitacion = ? AND estado = 'Disponible' LIMIT 1",
        [id_habitacion]
    );

    if (camaDisponible.length === 0) {
        res.status(409);
        throw new Error('No hay camas disponibles en esta habitación');
    }

    const id_cama = camaDisponible[0].id_cama;

    await execute(
        "UPDATE camas SET estado = 'Ocupada' WHERE id_cama = ?",
        [id_cama]
    );

    res.json({
        success: true,
        id_cama,
        numero_cama: camaDisponible[0].numero_cama,
        mensaje: `Cama ${camaDisponible[0].numero_cama} marcada como ocupada`
    });
});

module.exports = {
    obtenerInfraestructura,
    crearInfraestructura,
    actualizarInfraestructura,
    eliminarInfraestructura,
    ocuparCama,
};
