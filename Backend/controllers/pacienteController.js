const pool = require('../config/database');

const handleDatabaseError = (error, res, operation) => {
    console.error(`Error en ${operation}:`, error);
    res.status(500).json({
        success: false,
        message: `Error al ${operation}`,
        error: error.message
    });
};

// Obtener datos completos del paciente
const getDatosPaciente = async (req, res) => {
    const { id_paciente } = req.params;
    
    try {
        // Verificar que id_paciente sea un número válido
        if (!id_paciente || isNaN(id_paciente)) {
            return res.status(400).json({
                success: false,
                message: 'ID de paciente inválido'
            });
        }

        const [rows] = await pool.query(`
            SELECT 
                p.id_persona,
                p.nombre,
                p.apellido,
                p.email,
                p.dni,
                p.fecha_nacimiento,
                p.telefono,
                p.direccion,
                pac.obra_social,
                pac.numero_afiliado
            FROM pacientes pac
            INNER JOIN personas p ON pac.id_persona = p.id_persona
            WHERE pac.id_paciente = ?
        `, [id_paciente]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Paciente no encontrado'
            });
        }

        // Si encontramos al paciente, devolvemos sus datos
        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        handleDatabaseError(error, res, 'obtener datos del paciente');
    }
};

// Obtener historia clínica del paciente
const getHistoriaClinica = async (req, res) => {
    const { id_paciente } = req.params;
    
    try {
        // Verificar que id_paciente sea un número válido
        if (!id_paciente || isNaN(id_paciente)) {
            return res.status(400).json({
                success: false,
                message: 'ID de paciente inválido'
            });
        }

        // Primero verificamos si el paciente existe
        const [pacienteExiste] = await pool.query(
            'SELECT id_paciente FROM pacientes WHERE id_paciente = ?',
            [id_paciente]
        );

        if (pacienteExiste.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Paciente no encontrado'
            });
        }

        // Obtenemos la historia clínica
        const [rows] = await pool.query(`
            SELECT 
                hc.id_historia,
                hc.tipo_sangre as grupo_sanguineo,
                hc.alergias_conocidas as alergias,
                hc.condiciones_cronicas,
                hc.medicacion_actual,
                hc.antecedentes_quirurgicos,
                ce.nombre as nombre_contacto,
                ce.relacion as relacion_contacto,
                ce.telefono as telefono_contacto
            FROM historiasclinicas hc
            LEFT JOIN contactos_emergencia ce ON hc.id_paciente = ce.id_paciente
            WHERE hc.id_paciente = ?
        `, [id_paciente]);

        // Si no hay historia clínica, creamos una vacía
        if (rows.length === 0) {
            const [newHistoria] = await pool.query(`
                INSERT INTO historiasclinicas (
                    id_paciente, 
                    tipo_sangre, 
                    alergias_conocidas, 
                    condiciones_cronicas,
                    medicacion_actual,
                    antecedentes_quirurgicos
                ) VALUES (?, '', '', '', '', '')
            `, [id_paciente]);

            return res.json({
                success: true,
                data: {
                    id_historia: newHistoria.insertId,
                    grupo_sanguineo: '',
                    alergias: '',
                    condiciones_cronicas: '',
                    medicacion_actual: '',
                    antecedentes_quirurgicos: '',
                    nombre_contacto: null,
                    relacion_contacto: null,
                    telefono_contacto: null
                }
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        handleDatabaseError(error, res, 'obtener historia clínica');
    }
};

// Actualizar datos del paciente
const actualizarDatosPaciente = async (req, res) => {
    const { id_paciente } = req.params;
    const datosActualizados = req.body;
    
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Actualizar datos personales
            await connection.query(`
                UPDATE personas p
                INNER JOIN pacientes pac ON p.id_persona = pac.id_persona
                SET 
                    p.telefono = ?,
                    p.direccion = ?
                WHERE pac.id_paciente = ?
            `, [datosActualizados.telefono, datosActualizados.direccion, id_paciente]);

            // Actualizar datos del paciente
            await connection.query(`
                UPDATE pacientes 
                SET 
                    obra_social = ?,
                    numero_afiliado = ?
                WHERE id_paciente = ?
            `, [datosActualizados.obraSocial, datosActualizados.numeroAfiliado, id_paciente]);

            await connection.commit();
            res.json({
                success: true,
                message: 'Datos actualizados correctamente'
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error en actualizarDatosPaciente:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar los datos del paciente',
            error: error.message
        });
    }
};

// Obtener resumen del dashboard del paciente
const getDashboardResumen = async (req, res) => {
    const { id_paciente } = req.params;
    
    try {
        // 1. Obtener próximos turnos
        const [proximosTurnos] = await pool.query(`
            SELECT 
                t.id_turno,
                t.fecha,
                t.hora_inicio,
                t.estado,
                m.id_medico,
                CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
                e.nombre as especialidad
            FROM turnos t
            INNER JOIN medicos m ON t.id_medico = m.id_medico
            INNER JOIN personas p ON m.id_persona = p.id_persona
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE t.id_paciente = ?
            AND t.fecha >= CURDATE()
            AND t.estado IN ('Reservado', 'En Espera')
            ORDER BY t.fecha, t.hora_inicio
            LIMIT 5
        `, [id_paciente]);

        // 2. Obtener últimos estudios
        const [ultimosEstudios] = await pool.query(`
            SELECT 
                id_estudio,
                tipo_estudio,
                fecha_resultado,
                estado,
                ruta_resultado_pdf
            FROM estudiosmedicos
            WHERE id_paciente = ?
            AND estado = 'Resultado Disponible'
            ORDER BY fecha_resultado DESC
            LIMIT 3
        `, [id_paciente]);

        // 3. Obtener datos del paciente
        const [datosPaciente] = await pool.query(`
            SELECT 
                p.nombre,
                p.apellido,
                p.email,
                hc.tipo_sangre,
                hc.alergias_conocidas
            FROM pacientes pac
            INNER JOIN personas p ON pac.id_persona = p.id_persona
            LEFT JOIN historiasclinicas hc ON pac.id_paciente = hc.id_paciente
            WHERE pac.id_paciente = ?
        `, [id_paciente]);

        // 4. Obtener próximas recetas a vencer
        const [recetasProximasVencer] = await pool.query(`
            SELECT 
                r.id_receta,
                r.fecha_emision,
                CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
                GROUP_CONCAT(pr.nombre SEPARATOR ', ') as medicamentos
            FROM recetas r
            INNER JOIN medicos m ON r.id_medico = m.id_medico
            INNER JOIN personas p ON m.id_persona = p.id_persona
            INNER JOIN recetas_detalle rd ON r.id_receta = rd.id_receta
            INNER JOIN productos pr ON rd.id_producto = pr.id_producto
            WHERE r.id_consulta IN (
                SELECT id_consulta 
                FROM consultas c
                INNER JOIN historiasclinicas hc ON c.id_historia = hc.id_historia
                WHERE hc.id_paciente = ?
            )
            GROUP BY r.id_receta
            ORDER BY r.fecha_emision DESC
            LIMIT 3
        `, [id_paciente]);

        res.json({
            success: true,
            data: {
                paciente: datosPaciente[0],
                proximosTurnos,
                ultimosEstudios,
                recetasProximasVencer
            }
        });

    } catch (error) {
        console.error('Error en getDashboardResumen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el resumen del dashboard',
            error: error.message
        });
    }
};

// Cancelar un turno
const cancelarTurno = async (req, res) => {
    const { id_turno } = req.params;
    
    try {
        await pool.query('UPDATE turnos SET estado = "Cancelado" WHERE id_turno = ?', [id_turno]);
        
        res.json({
            success: true,
            message: 'Turno cancelado exitosamente'
        });
    } catch (error) {
        console.error('Error en cancelarTurno:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cancelar el turno',
            error: error.message
        });
    }
};

// Obtener estudios del paciente
const getEstudios = async (req, res) => {
    const { id_paciente } = req.params;
    
    try {
        const [estudios] = await pool.query(`
            SELECT 
                em.id_estudio,
                em.tipo_estudio,
                em.fecha_solicitud,
                em.fecha_resultado,
                em.estado,
                em.ruta_resultado_pdf,
                CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
                p.apellido as apellido_medico,
                es.nombre as especialidad
            FROM estudiosmedicos em
            INNER JOIN medicos m ON em.id_medico = m.id_medico
            INNER JOIN personas p ON m.id_persona = p.id_persona
            INNER JOIN especialidades es ON m.id_especialidad = es.id_especialidad
            WHERE em.id_paciente = ?
            ORDER BY em.fecha_solicitud DESC
        `, [id_paciente]);

        res.json({
            success: true,
            data: estudios
        });

    } catch (error) {
        console.error('Error en getEstudios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los estudios médicos',
            error: error.message
        });
    }
};

// Obtener recetas del paciente
const getRecetas = async (req, res) => {
    const { id_paciente } = req.params;
    
    try {
        const [recetas] = await pool.query(`
            SELECT 
                r.id_receta,
                r.fecha_emision,
                r.fecha_vencimiento,
                r.estado,
                r.renovaciones_disponibles,
                CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
                p.apellido as apellido_medico,
                GROUP_CONCAT(
                    CONCAT(pr.nombre, ': ', rd.dosis, ' - ', rd.frecuencia)
                    SEPARATOR '|'
                ) as medicamentos_y_dosis
            FROM recetas r
            INNER JOIN medicos m ON r.id_medico = m.id_medico
            INNER JOIN personas p ON m.id_persona = p.id_persona
            INNER JOIN recetas_detalle rd ON r.id_receta = rd.id_receta
            INNER JOIN productos pr ON rd.id_producto = pr.id_producto
            WHERE r.id_consulta IN (
                SELECT id_consulta 
                FROM consultas c
                INNER JOIN historiasclinicas hc ON c.id_historia = hc.id_historia
                WHERE hc.id_paciente = ?
            )
            GROUP BY r.id_receta
            ORDER BY r.fecha_emision DESC
        `, [id_paciente]);

        const recetasFormateadas = recetas.map(receta => ({
            ...receta,
            medicamentos: receta.medicamentos_y_dosis.split('|').map(med => {
                const [medicamento, dosis] = med.split(': ');
                const [cantidad, frecuencia] = dosis.split(' - ');
                return { medicamento, dosis: cantidad, frecuencia };
            })
        }));

        res.json({
            success: true,
            data: recetasFormateadas
        });

    } catch (error) {
        console.error('Error en getRecetas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las recetas',
            error: error.message
        });
    }
};

// Exportar todas las funciones del controlador
module.exports = {
    getDashboardResumen,    // Dashboard del paciente
    cancelarTurno,         // Gestión de turnos
    getDatosPaciente,      // Datos personales
    getHistoriaClinica,    // Historia clínica
    actualizarDatosPaciente, // Actualización de datos
    getEstudios,           // Estudios médicos
    getRecetas            // Recetas médicas
};