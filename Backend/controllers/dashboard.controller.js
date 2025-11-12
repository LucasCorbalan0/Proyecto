const asyncHandler = require('express-async-handler');
const { execute } = require('../config/database');



const obtenerDashboardAdmin = asyncHandler(async (req, res) => {
    try {
        // 1ESTADÍSTICAS GENERALES
        const estadisticasGenerales = await execute(`
            SELECT 
                (SELECT COUNT(*) FROM usuarios WHERE activo = 1) as usuarios_activos,
                (SELECT COUNT(*) FROM usuarios) as usuarios_totales,
                (SELECT COUNT(*) FROM pacientes) as total_pacientes,
                (SELECT COUNT(*) FROM medicos) as total_medicos,
                (SELECT COUNT(*) FROM especialidades) as total_especialidades
        `);

        // 2️OCUPACIÓN DE INFRAESTRUCTURA - CAMAS
        const ocupacionCamas = await execute(`
            SELECT 
                COUNT(*) as total_camas,
                SUM(CASE WHEN estado = 'Disponible' THEN 1 ELSE 0 END) as camas_disponibles,
                SUM(CASE WHEN estado = 'Ocupada' THEN 1 ELSE 0 END) as camas_ocupadas,
                SUM(CASE WHEN estado = 'En Mantenimiento' THEN 1 ELSE 0 END) as en_mantenimiento,
                SUM(CASE WHEN estado = 'Limpieza' THEN 1 ELSE 0 END) as en_limpieza,
                ROUND((SUM(CASE WHEN estado = 'Ocupada' THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) as porcentaje_ocupacion
            FROM camas
        `);

        // 3️⃣ ESTADO DE QUIRÓFANOS
        const estadoQuirofanos = await execute(`
            SELECT 
                COUNT(*) as total_quirofanos,
                SUM(CASE WHEN estado = 'Disponible' THEN 1 ELSE 0 END) as disponibles,
                SUM(CASE WHEN estado = 'Ocupado' THEN 1 ELSE 0 END) as ocupados,
                SUM(CASE WHEN estado = 'En Mantenimiento' THEN 1 ELSE 0 END) as en_mantenimiento,
                SUM(CASE WHEN estado = 'Limpieza' THEN 1 ELSE 0 END) as en_limpieza
            FROM quirofanos
        `);

        // 4️⃣ TURNOS POR ESTADO (HOY Y PRÓXIMOS 7 DÍAS)
        const turnosPorEstado = await execute(`
            SELECT 
                estado,
                COUNT(*) as cantidad
            FROM turnos
            WHERE fecha >= CURDATE() AND fecha <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
            GROUP BY estado
        `);

        // 5️⃣ INTERNACIONES ACTIVAS
        const internacionesActivas = await execute(`
            SELECT 
                COUNT(*) as total_internaciones_activas,
                ROUND(AVG(DATEDIFF(NOW(), fecha_ingreso)), 1) as dias_promedio_internacion
            FROM internaciones
            WHERE estado = 'Activa'
        `);

        // 6️⃣ MÉDICOS Y SUS TURNOS PROGRAMADOS
        const medicosConTurnos = await execute(`
            SELECT 
                m.id_medico,
                CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
                e.nombre as especialidad,
                COUNT(t.id_turno) as turnos_proximos
            FROM medicos m
            INNER JOIN personas p ON m.id_persona = p.id_persona
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            LEFT JOIN turnos t ON m.id_medico = t.id_medico 
                AND t.fecha >= CURDATE() 
                AND t.estado IN ('Reservado', 'En Espera')
            GROUP BY m.id_medico, p.nombre, p.apellido, e.nombre
            ORDER BY turnos_proximos DESC
            LIMIT 10
        `);

        // 7️⃣ FACTURACIÓN Y PAGOS (ÚLTIMOS 30 DÍAS)
        const facturacion = await execute(`
            SELECT 
                COUNT(DISTINCT id_factura) as total_facturas,
                SUM(CASE WHEN estado_pago = 'Pagada' THEN 1 ELSE 0 END) as facturas_pagadas,
                SUM(CASE WHEN estado_pago = 'Pendiente' THEN 1 ELSE 0 END) as facturas_pendientes,
                SUM(total) as ingresos_totales,
                SUM(CASE WHEN estado_pago = 'Pagada' THEN total ELSE 0 END) as ingresos_efectivos
            FROM facturacion
            WHERE fecha_emision >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        `);

        // 8️⃣ PRODUCTOS Y STOCK
        const stock = await execute(`
            SELECT 
                COUNT(DISTINCT id_producto) as total_productos,
                SUM(cantidad_actual) as stock_total,
                SUM(CASE WHEN cantidad_actual <= 10 THEN 1 ELSE 0 END) as productos_bajo_stock
            FROM stock_lotes
        `);

        // 9️⃣ CIRUGÍAS PROGRAMADAS (PRÓXIMOS 7 DÍAS)
        const cirugiasProximas = await execute(`
            SELECT 
                COUNT(*) as cirugias_programadas,
                SUM(CASE WHEN estado = 'Realizada' THEN 1 ELSE 0 END) as cirugias_realizadas
            FROM cirugias
            WHERE fecha_programada >= CURDATE() 
                AND fecha_programada <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
        `);

        // 🔟 DISTRIBUCIÓN DE PACIENTES POR ESPECIALIDAD
        const pacientesPorEspecialidad = await execute(`
            SELECT 
                e.nombre as especialidad,
                COUNT(DISTINCT t.id_paciente) as cantidad_pacientes
            FROM especialidades e
            LEFT JOIN medicos m ON e.id_especialidad = m.id_especialidad
            LEFT JOIN turnos t ON m.id_medico = t.id_medico
                AND t.fecha >= CURDATE() 
                AND t.estado IN ('Reservado', 'En Espera')
            GROUP BY e.id_especialidad, e.nombre
            ORDER BY cantidad_pacientes DESC
        `);

        res.json({
            success: true,
            data: {
                estadisticasGenerales: estadisticasGenerales[0],
                ocupacionCamas: ocupacionCamas[0],
                estadoQuirofanos: estadoQuirofanos[0],
                turnosPorEstado,
                internacionesActivas: internacionesActivas[0],
                medicosConTurnos,
                facturacion: facturacion[0],
                stock: stock[0],
                cirugiasProximas: cirugiasProximas[0],
                pacientesPorEspecialidad,
                fechaActual: new Date().toISOString().split('T')[0]
            }
        });

    } catch (error) {
        console.error('Error en obtenerDashboardAdmin:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el dashboard',
            error: error.message
        });
    }
});

/**
 * Obtener últimos pacientes internados
 */
const getPacientesInternados = asyncHandler(async (req, res) => {
    const pacientes = await execute(`
        SELECT 
            i.id_internacion,
            CONCAT(p.nombre, ' ', p.apellido) as paciente,
            p.dni,
            h.numero_habitacion,
            c.numero_cama,
            CONCAT(pm.nombre, ' ', pm.apellido) as medico_responsable,
            e.nombre as especialidad,
            i.fecha_ingreso,
            DATEDIFF(NOW(), i.fecha_ingreso) as dias_internado
        FROM internaciones i
        INNER JOIN pacientes pac ON i.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        LEFT JOIN camas c ON i.id_cama = c.id_cama
        LEFT JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
        INNER JOIN medicos m ON i.id_medico = m.id_medico
        INNER JOIN personas pm ON m.id_persona = pm.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE i.estado = 'Activa'
        ORDER BY i.fecha_ingreso DESC
    `);

    res.json({
        success: true,
        total: pacientes.length,
        data: pacientes
    });
});

/**
 * Obtener últimas facturaciones con detalles
 */
const getUltimasFacturas = asyncHandler(async (req, res) => {
    const { limite = 20 } = req.query;
    
    const facturas = await execute(`
        SELECT 
            f.id_factura,
            f.fecha_emision,
            CONCAT(p.nombre, ' ', p.apellido) as paciente,
            p.dni,
            f.total,
            f.estado_pago,
            COUNT(fd.id_detalle) as items
        FROM facturacion f
        INNER JOIN pacientes pac ON f.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        LEFT JOIN facturacion_detalle fd ON f.id_factura = fd.id_factura
        GROUP BY f.id_factura
        ORDER BY f.fecha_emision DESC
        LIMIT ?
    `, [parseInt(limite)]);

    res.json({
        success: true,
        data: facturas
    });
});

/**
 * Obtener próximas cirugías programadas
 */
const getProximasCirugias = asyncHandler(async (req, res) => {
    const cirugias = await execute(`
        SELECT 
            c.id_cirugia,
            CONCAT(p.nombre, ' ', p.apellido) as paciente,
            p.dni,
            c.tipo_cirugia,
            CONCAT(pm.nombre, ' ', pm.apellido) as medico,
            e.nombre as especialidad,
            c.fecha_programada,
            c.estado,
            q.nombre as quirofano
        FROM cirugias c
        INNER JOIN pacientes pac ON c.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        INNER JOIN medicos m ON c.id_medico = m.id_medico
        INNER JOIN personas pm ON m.id_persona = pm.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        LEFT JOIN quirofanos q ON c.id_quirofano = q.id_quirofano
        WHERE c.fecha_programada >= CURDATE()
        ORDER BY c.fecha_programada
        LIMIT 10
    `);

    res.json({
        success: true,
        data: cirugias
    });
});

/**
 * Obtener especialidades más solicitadas
 */
const getEspecialidadesPopulares = asyncHandler(async (req, res) => {
    const datos = await execute(`
        SELECT 
            e.nombre as especialidad,
            COUNT(t.id_turno) as cantidad_turnos,
            SUM(CASE WHEN t.estado = 'Atendido' THEN 1 ELSE 0 END) as atendidos,
            COUNT(DISTINCT t.id_paciente) as pacientes_unicos
        FROM especialidades e
        INNER JOIN medicos m ON e.id_especialidad = m.id_especialidad
        LEFT JOIN turnos t ON m.id_medico = t.id_medico
        GROUP BY e.id_especialidad, e.nombre
        ORDER BY cantidad_turnos DESC
    `);

    res.json({
        success: true,
        data: datos
    });
});

module.exports = {
    obtenerDashboardAdmin,
    getPacientesInternados,
    getUltimasFacturas,
    getProximasCirugias,
    getEspecialidadesPopulares
};
