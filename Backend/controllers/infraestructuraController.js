// Backend/controllers/infraestructuraController.js
const asyncHandler = require('express-async-handler');
const { pool, execute } = require('../config/database');

// Obtener todas las habitaciones con sus camas
const obtenerInfraestructura = asyncHandler(async (req, res) => {
    const query = `
        SELECT
            h.id_habitacion AS id,
            h.numero_habitacion AS id_display,
            h.tipo_habitacion AS tipo,
            COUNT(c.id_cama) AS camas,
            IFNULL(SUM(CASE WHEN c.estado = 'Ocupada' THEN 1 ELSE 0 END), 0) AS ocupadas
        FROM habitaciones h
        LEFT JOIN camas c ON h.id_habitacion = c.id_habitacion
        GROUP BY h.id_habitacion, h.numero_habitacion, h.tipo_habitacion
        ORDER BY h.numero_habitacion ASC;
    `;
    
    const [queryResult] = await execute(query);
    const filas = Array.isArray(queryResult) ? queryResult : [];

    const data = filas.map(fila => ({
        id: fila.id,
        id_display: fila.id_display,
        tipo: fila.tipo,
        camas: parseInt(fila.camas, 10) || 0,
        ocupadas: parseInt(fila.ocupadas, 10) || 0,
    }));

    res.status(200).json(data);
});

// Crear una nueva habitación
const crearInfraestructura = asyncHandler(async (req, res) => {
    const { id: numero_habitacion, tipo: tipo_habitacion, camas: num_camas_total } = req.body;
    const numCamas = parseInt(num_camas_total, 10);

    if (!numero_habitacion || !tipo_habitacion) {
        res.status(400);
        throw new Error('Faltan datos: número o tipo de habitación.');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Insertamos la habitación
        const [habitacionResult] = await connection.query(
            "INSERT INTO habitaciones (numero_habitacion, tipo_habitacion) VALUES (?, ?)",
            [numero_habitacion, tipo_habitacion]
        );
        const id_habitacion = habitacionResult.insertId;

        // Si tiene camas, se crean
        if (numCamas > 0) {
            const camaQuery = "INSERT INTO camas (id_habitacion, numero_cama, estado) VALUES (?, ?, 'Disponible')";
            const camasPromises = [];

            for (let i = 1; i <= numCamas; i++) {
                const numero_cama = String.fromCharCode(64 + i); // A, B, C...
                camasPromises.push(connection.query(camaQuery, [id_habitacion, numero_cama]));
            }

            await Promise.all(camasPromises);
        }

        await connection.commit();
        connection.release();

        res.status(201).json({
            id: id_habitacion,
            id_display: numero_habitacion,
            tipo: tipo_habitacion,
            camas: numCamas,
            ocupadas: 0,
            message: `Habitación ${numero_habitacion} creada correctamente.`,
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409);
            throw new Error(`El número ${numero_habitacion} ya existe.`);
        }
        res.status(500);
        throw new Error('Error al crear la habitación.');
    }
});

// Actualizar una habitación
const actualizarInfraestructura = asyncHandler(async (req, res) => {
    const id_habitacion = req.params.id;
    const { tipo: tipo_habitacion } = req.body;

    if (!tipo_habitacion) {
        res.status(400);
        throw new Error('El tipo de habitación es obligatorio.');
    }

    const query = `
        UPDATE habitaciones
        SET tipo_habitacion = ?
        WHERE id_habitacion = ?
    `;
    const [resultado] = await execute(query, [tipo_habitacion, id_habitacion]);

    if (resultado.affectedRows === 0) {
        res.status(404);
        throw new Error('Habitación no encontrada.');
    }

    res.status(200).json({ id: parseInt(id_habitacion, 10), message: 'Habitación actualizada correctamente.' });
});

// Eliminar una habitación
const eliminarInfraestructura = asyncHandler(async (req, res) => {
    const id_habitacion = req.params.id;

    const [resultado] = await execute(
        "DELETE FROM habitaciones WHERE id_habitacion = ?",
        [id_habitacion]
    );

    if (resultado.affectedRows === 0) {
        res.status(404);
        throw new Error('Habitación no encontrada.');
    }

    res.status(200).json({ id: parseInt(id_habitacion, 10), message: 'Habitación eliminada correctamente.' });
});

// Marcar una cama como ocupada
const ocuparCama = asyncHandler(async (req, res) => {
    const id_habitacion = req.params.habitacionId;

    const [camaRows] = await execute(
        "SELECT id_cama, numero_cama FROM camas WHERE id_habitacion = ? AND estado = 'Disponible' LIMIT 1",
        [id_habitacion]
    );

    const filas = Array.isArray(camaRows) ? camaRows : [];

    if (filas.length === 0) {
        res.status(409);
        throw new Error('No hay camas disponibles en esta habitación.');
    }

    const id_cama = filas[0].id_cama;

    await execute(
        "UPDATE camas SET estado = 'Ocupada' WHERE id_cama = ?",
        [id_cama]
    );

    res.status(200).json({
        message: `Cama ${filas[0].numero_cama} marcada como ocupada.`,
        id_cama: id_cama
    });
});

module.exports = {
    obtenerInfraestructura,
    crearInfraestructura,
    actualizarInfraestructura,
    eliminarInfraestructura,
    ocuparCama,
};
