const { execute } = require("../config/database");
const asyncHandler = require("express-async-handler");

// Obtener datos completos del paciente
const getDatosPaciente = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  // Verificar que id_paciente sea un número válido
  if (!id_paciente || isNaN(id_paciente)) {
    res.status(400);
    throw new Error("ID de paciente inválido");
  }

  const rows = await execute(
    `
        SELECT 
            p.id_persona,
            p.nombre,
            p.apellido,
            p.email,
            p.dni,
            p.fecha_nacimiento,
            p.telefono,
            p.direccion,
            pac.id_paciente
        FROM pacientes pac
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        WHERE pac.id_paciente = ?
    `,
    [id_paciente]
  );

  if (rows.length === 0) {
    res.status(404);
    throw new Error("Paciente no encontrado");
  }

  // Si encontramos al paciente, devolvemos sus datos
  res.json({
    success: true,
    data: rows[0],
  });
});

// Crear o actualizar la historia clínica del paciente
const actualizarHistoriaClinica = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;
  const {
    tipo_sangre,
    factor_rh,
    alergias_conocidas,
    comorbilidades_cronicas,
    medicacion_habitual,
    antecedentes_quirurgicos,
    contacto_emergencia_nombre,
    contacto_emergencia_telefono,
  } = req.body;

  if (!id_paciente || isNaN(id_paciente)) {
    res.status(400);
    throw new Error("ID de paciente inválido");
  }

  // Verificamos si existe una historia para este paciente
  const existente = await execute(
    "SELECT id_historia FROM historiasclinicas WHERE id_paciente = ?",
    [id_paciente]
  );

  if (existente.length === 0) {
    // Insertar nueva historia
    const resultado = await execute(
      `
            INSERT INTO historiasclinicas (
                id_paciente,
                tipo_sangre,
                factor_rh,
                alergias_conocidas,
                comorbilidades_cronicas,
                medicacion_habitual,
                antecedentes_quirurgicos,
                contacto_emergencia_nombre,
                contacto_emergencia_telefono,
                fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
      [
        id_paciente,
        tipo_sangre || null,
        factor_rh || null,
        alergias_conocidas || null,
        comorbilidades_cronicas || null,
        medicacion_habitual || null,
        antecedentes_quirurgicos || null,
        contacto_emergencia_nombre || null,
        contacto_emergencia_telefono || null,
      ]
    );

    const nueva = await execute(
      "SELECT * FROM historiasclinicas WHERE id_historia = ?",
      [resultado.insertId]
    );

    return res.status(201).json({ success: true, data: nueva[0] });
  }

  // Actualizar historia existente
  const updateResult = await execute(
    `
        UPDATE historiasclinicas SET
            tipo_sangre = ?,
            factor_rh = ?,
            alergias_conocidas = ?,
            comorbilidades_cronicas = ?,
            medicacion_habitual = ?,
            antecedentes_quirurgicos = ?,
            contacto_emergencia_nombre = ?,
            contacto_emergencia_telefono = ?
        WHERE id_paciente = ?
    `,
    [
      tipo_sangre || null,
      factor_rh || null,
      alergias_conocidas || null,
      comorbilidades_cronicas || null,
      medicacion_habitual || null,
      antecedentes_quirurgicos || null,
      contacto_emergencia_nombre || null,
      contacto_emergencia_telefono || null,
      id_paciente,
    ]
  );

  const actualizado = await execute(
    "SELECT * FROM historiasclinicas WHERE id_paciente = ?",
    [id_paciente]
  );

  res.json({ success: true, data: actualizado[0] });
});

// Obtener historia clínica del paciente
const getHistoriaClinica = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  // Verificar que id_paciente sea un número válido
  if (!id_paciente || isNaN(id_paciente)) {
    res.status(400);
    throw new Error("ID de paciente inválido");
  }

  // Primero verificamos si el paciente existe
  const pacienteExiste = await execute(
    "SELECT id_paciente FROM pacientes WHERE id_paciente = ?",
    [id_paciente]
  );

  if (pacienteExiste.length === 0) {
    res.status(404);
    throw new Error("Paciente no encontrado");
  }

  // Obtenemos la historia clínica
  const rows = await execute(
    `
        SELECT 
            hc.id_historia,
            hc.tipo_sangre,
            hc.factor_rh,
            hc.alergias_conocidas,
            hc.comorbilidades_cronicas,
            hc.medicacion_habitual,
            hc.antecedentes_quirurgicos,
            hc.contacto_emergencia_nombre,
            hc.contacto_emergencia_telefono
        FROM historiasclinicas hc
        WHERE hc.id_paciente = ?
    `,
    [id_paciente]
  );

  // Si no hay historia clínica, creamos una
  if (rows.length === 0) {
    const resultadoNueva = await execute(
      `
            INSERT INTO historiasclinicas (
                id_paciente,
                fecha_creacion
            ) VALUES (?, NOW())
        `,
      [id_paciente]
    );

    return res.json({
      success: true,
      data: {
        id_historia: resultadoNueva.insertId,
        tipo_sangre: null,
        factor_rh: null,
        alergias_conocidas: null,
        comorbilidades_cronicas: null,
        medicacion_habitual: null,
        antecedentes_quirurgicos: null,
        contacto_emergencia_nombre: null,
        contacto_emergencia_telefono: null,
      },
    });
  }

  res.json({
    success: true,
    data: rows[0],
  });
});

// Actualizar datos del paciente
const actualizarDatosPaciente = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;
  const datosActualizados = req.body;

  // Actualizar datos personales
  await execute(
    `
        UPDATE personas p
        INNER JOIN pacientes pac ON p.id_persona = pac.id_persona
        SET 
            p.telefono = ?,
            p.direccion = ?,
            p.email = ?
        WHERE pac.id_paciente = ?
    `,
    [
      datosActualizados.telefono || null,
      datosActualizados.direccion || null,
      datosActualizados.email || null,
      id_paciente,
    ]
  );

  // Devolver los datos actualizados para confirmar en frontend
  const rows = await execute(
    `
        SELECT 
            p.id_persona,
            p.nombre,
            p.apellido,
            p.email,
            p.dni,
            p.fecha_nacimiento,
            p.telefono,
            p.direccion,
            pac.id_paciente
        FROM pacientes pac
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        WHERE pac.id_paciente = ?
    `,
    [id_paciente]
  );

  res.json({
    success: true,
    message: "Datos actualizados correctamente",
    data: rows[0] || {},
  });
});

// Obtener resumen del dashboard del paciente
const getDashboardResumen = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  // Validar que el paciente existe
  const pacienteValidar = await execute(
    "SELECT id_paciente FROM pacientes WHERE id_paciente = ?",
    [id_paciente]
  );

  if (pacienteValidar.length === 0) {
    res.status(404);
    throw new Error("Paciente no encontrado");
  }

  //  DATOS DEL PACIENTE
  const datosPaciente = await execute(
    `
        SELECT 
            pac.id_paciente,
            p.id_persona,
            p.nombre,
            p.apellido,
            p.email,
            p.dni,
            p.fecha_nacimiento,
            p.telefono,
            p.direccion,
            hc.id_historia,
            hc.tipo_sangre,
            hc.factor_rh,
            hc.alergias_conocidas,
            hc.comorbilidades_cronicas,
            hc.medicacion_habitual,
            hc.antecedentes_quirurgicos,
            hc.contacto_emergencia_nombre,
            hc.contacto_emergencia_telefono
        FROM pacientes pac
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        LEFT JOIN historiasclinicas hc ON pac.id_paciente = hc.id_paciente
        WHERE pac.id_paciente = ?
    `,
    [id_paciente]
  );

  //  PRÓXIMOS TURNOS (próximos 30 días)
  const proximosTurnos = await execute(
    `
        SELECT 
            t.id_turno,
            t.fecha,
            t.hora_inicio,
            t.hora_fin,
            t.estado,
            m.id_medico,
            CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
            p.email as email_medico,
            e.nombre as especialidad
        FROM turnos t
        INNER JOIN medicos m ON t.id_medico = m.id_medico
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE t.id_paciente = ?
        AND t.fecha >= CURDATE()
        AND t.fecha <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        AND t.estado IN ('Reservado', 'En Espera')
        ORDER BY t.fecha ASC, t.hora_inicio ASC
        LIMIT 5
    `,
    [id_paciente]
  );

  //  ESTUDIOS MÉDICOS DISPONIBLES
  const ultimosEstudios = await execute(
    `
        SELECT 
            em.id_estudio,
            em.tipo_estudio,
            em.fecha_solicitud,
            em.fecha_resultado,
            em.estado,
            em.ruta_resultado_pdf,
            CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
            e.nombre as especialidad
        FROM estudiosmedicos em
        INNER JOIN medicos m ON em.id_medico = m.id_medico
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE em.id_paciente = ?
        AND em.estado IN ('Resultado Disponible', 'Realizado')
        ORDER BY em.fecha_resultado DESC
        LIMIT 5
    `,
    [id_paciente]
  );

  // RECETAS PRÓXIMAS A VENCER (vigentes)
  const recetasProximasVencer = await execute(
    `
        SELECT 
            r.id_receta,
            r.fecha_emision,
            DATE_ADD(r.fecha_emision, INTERVAL 6 MONTH) as fecha_vencimiento,
            pr.nombre as medicamento,
            rd.dosis,
            rd.frecuencia,
            rd.cantidad,
            CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
            p.apellido as apellido_medico,
            e.nombre as especialidad
        FROM recetas r
        INNER JOIN medicos m ON r.id_medico = m.id_medico
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        INNER JOIN recetas_detalle rd ON r.id_receta = rd.id_receta
        INNER JOIN productos pr ON rd.id_producto = pr.id_producto
        WHERE r.id_consulta IN (
            SELECT id_consulta 
            FROM consultas c
            INNER JOIN historiasclinicas hc ON c.id_historia = hc.id_historia
            WHERE hc.id_paciente = ?
        )
        AND DATE_ADD(r.fecha_emision, INTERVAL 6 MONTH) > NOW()
        ORDER BY r.fecha_emision DESC
        LIMIT 3
    `,
    [id_paciente]
  );

  // 5️ÚLTIMAS CONSULTAS/EVOLUCIONES
  const ultimasConsultas = await execute(
    `
        SELECT 
            c.id_consulta,
            c.fecha_consulta,
            CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
            e.nombre as especialidad,
            c.motivo_consulta,
            c.diagnostico,
            c.tratamiento
        FROM consultas c
        INNER JOIN medicos m ON c.id_medico = m.id_medico
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        INNER JOIN historiasclinicas hc ON c.id_historia = hc.id_historia
        WHERE hc.id_paciente = ?
        ORDER BY c.fecha_consulta DESC
        LIMIT 3
    `,
    [id_paciente]
  );

  // 6INTERNACIONES ACTIVAS
  const internacionesActivas = await execute(
    `
        SELECT 
            i.id_internacion,
            i.fecha_ingreso,
            i.estado,
            h.numero_habitacion,
            c.numero_cama,
            CONCAT(p.nombre, ' ', p.apellido) as medico,
            e.nombre as especialidad,
            DATEDIFF(NOW(), i.fecha_ingreso) as dias_internado
        FROM internaciones i
        INNER JOIN medicos m ON i.id_medico = m.id_medico
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        LEFT JOIN camas c ON i.id_cama = c.id_cama
        LEFT JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
        WHERE i.id_paciente = ?
        AND i.estado = 'Activa'
        LIMIT 1
    `,
    [id_paciente]
  );

  //  EVOLUCIONES CLÍNICAS RECIENTES
  const evolucionesRecientes = await execute(
    `
        SELECT 
            e.id_evolucion,
            e.fecha_evolucion,
            e.nota,
            e.temperatura,
            e.presion_arterial_sistolica,
            e.presion_arterial_diastolica,
            e.frecuencia_cardiaca,
            e.saturacion_oxigeno,
            e.tipo_personal,
            CONCAT(p.nombre, ' ', p.apellido) as personal_nombre
        FROM evoluciones e
        LEFT JOIN personas p ON e.id_personal = p.id_persona
        WHERE e.id_historia = (
            SELECT id_historia FROM historiasclinicas WHERE id_paciente = ?
        )
        ORDER BY e.fecha_evolucion DESC
        LIMIT 5
    `,
    [id_paciente]
  );

  res.json({
    success: true,
    data: {
      paciente: datosPaciente[0] || {},
      proximosTurnos,
      ultimosEstudios,
      recetasProximasVencer,
      ultimasConsultas,
      internacionesActivas,
      evolucionesRecientes,
      resumen: {
        turnos_proximos: proximosTurnos.length,
        estudios_disponibles: ultimosEstudios.length,
        recetas_activas: recetasProximasVencer.length,
        internado: internacionesActivas.length > 0,
      },
    },
  });
});

// Cancelar un turno
const cancelarTurno = asyncHandler(async (req, res) => {
  const { id_turno } = req.params;

  await execute("UPDATE turnos SET estado = ? WHERE id_turno = ?", [
    "Cancelado",
    id_turno,
  ]);

  res.json({
    success: true,
    message: "Turno cancelado exitosamente",
  });
});

// Obtener estudios del paciente
const getEstudios = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  const estudios = await execute(
    `
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
    `,
    [id_paciente]
  );

  res.json({
    success: true,
    data: estudios,
  });
});

// Obtener recetas del paciente
const getRecetas = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  // Obtener todas las líneas de recetas (cada medicamento es una fila separada)
  const recetas = await execute(
    `
        SELECT 
            r.id_receta,
            r.fecha_emision,
            DATE_ADD(r.fecha_emision, INTERVAL 6 MONTH) as fecha_vencimiento,
            pr.nombre as medicamento,
            rd.dosis,
            rd.frecuencia,
            rd.cantidad,
            CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
            p.apellido as apellido_medico,
            e.nombre as especialidad
        FROM recetas r
        INNER JOIN medicos m ON r.id_medico = m.id_medico
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        INNER JOIN recetas_detalle rd ON r.id_receta = rd.id_receta
        INNER JOIN productos pr ON rd.id_producto = pr.id_producto
        WHERE r.id_consulta IN (
            SELECT id_consulta 
            FROM consultas c
            INNER JOIN historiasclinicas hc ON c.id_historia = hc.id_historia
            WHERE hc.id_paciente = ?
        )
        ORDER BY r.fecha_emision DESC
    `,
    [id_paciente]
  );

  res.json({
    success: true,
    data: recetas,
  });
});

// Obtener consultas del paciente
const getConsultas = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  const consultas = await execute(
    `
        SELECT 
            c.id_consulta,
            c.fecha_consulta as fecha,
            CONCAT(p.nombre, ' ', p.apellido) as medico,
            e.nombre as especialidad,
            c.motivo_consulta as motivo,
            c.diagnostico,
            c.tratamiento
        FROM consultas c
        INNER JOIN medicos m ON c.id_medico = m.id_medico
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        INNER JOIN historiasclinicas hc ON c.id_historia = hc.id_historia
        WHERE hc.id_paciente = ?
        ORDER BY c.fecha_consulta DESC
    `,
    [id_paciente]
  );

  res.json({
    success: true,
    data: consultas,
  });
});

// Obtener facturas del paciente
const getFacturas = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  const facturas = await execute(
    `
        SELECT 
            f.id_factura,
            f.fecha_emision,
            f.total as monto,
            f.estado_pago as estado,
            COALESCE(GROUP_CONCAT(
                CONCAT(fd.descripcion_item, ' x', fd.cantidad)
                SEPARATOR ', '
            ), 'Sin detalle') as concepto
        FROM facturacion f
        LEFT JOIN facturacion_detalle fd ON f.id_factura = fd.id_factura
        WHERE f.id_paciente = ?
        GROUP BY f.id_factura
        ORDER BY f.fecha_emision DESC
    `,
    [id_paciente]
  );

  res.json({
    success: true,
    data: facturas,
  });
});

const getEspecialidades = asyncHandler(async (req, res) => {
  const especialidades = await execute(`
        SELECT 
            id_especialidad,
            nombre,
            es_quirurgica
        FROM especialidades
        ORDER BY nombre ASC
    `);

  res.json({
    success: true,
    total: especialidades.length,
    data: especialidades,
  });
});

// Obtener médicos
const getMedicos = asyncHandler(async (req, res) => {
  const { id_especialidad, busqueda } = req.query;

  let query = `
        SELECT 
            m.id_medico,
            m.matricula,
            p.nombre,
            p.apellido,
            CONCAT(p.nombre, ' ', p.apellido) as nombres,
            p.email,
            p.telefono,
            es.id_especialidad,
            es.nombre as especialidad,
            COALESCE(COUNT(DISTINCT c.id_consulta), 0) as total_consultas,
            COALESCE(AVG(CAST(c.diagnostico IS NOT NULL AS UNSIGNED)), 0) as calificacion_promedio
        FROM medicos m
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades es ON m.id_especialidad = es.id_especialidad
        LEFT JOIN consultas c ON m.id_medico = c.id_medico
        WHERE 1=1
    `;

  const params = [];

  if (id_especialidad) {
    query += ` AND m.id_especialidad = ?`;
    params.push(id_especialidad);
  }

  if (busqueda) {
    query += ` AND (p.nombre LIKE ? OR p.apellido LIKE ? OR m.matricula LIKE ?)`;
    const searchTerm = `%${busqueda}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += `
        GROUP BY m.id_medico
        ORDER BY calificacion_promedio DESC, p.apellido ASC
    `;

  const medicos = await execute(query, params);

  res.json({
    success: true,
    total: medicos.length,
    data: medicos,
  });
});

// Obtener disponibilidad de un médico
const getDisponibilidadMedicos = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;
  const { fecha_inicio, fecha_fin } = req.query;

  // Validar que se proporcionen fechas
  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({
      success: false,
      message: "Debe proporcionar fecha_inicio y fecha_fin",
    });
  }

  const disponibilidad = await execute(
    `
        SELECT 
            id_disponibilidad,
            id_medico,
            fecha,
            hora_inicio,
            hora_fin
        FROM disponibilidad_medicos
        WHERE id_medico = ?
        AND fecha BETWEEN ? AND ?
        ORDER BY fecha ASC, hora_inicio ASC
    `,
    [id_medico, fecha_inicio, fecha_fin]
  );

  res.json({
    success: true,
    data: disponibilidad,
  });
});

// Reservar turno con médico
const reservarTurno = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;
  const { id_medico, fecha_turno, motivo } = req.body;

  // Validaciones
  if (!id_medico || !fecha_turno) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos requeridos: id_medico, fecha_turno",
    });
  }

  const medicoId = parseInt(id_medico);
  const pacienteId = parseInt(id_paciente);

  if (isNaN(medicoId) || isNaN(pacienteId)) {
    return res.status(400).json({
      success: false,
      message: "IDs inválidos",
    });
  }

  // Verificar que el médico existe
  const medico = await execute(
    "SELECT id_medico FROM medicos WHERE id_medico = ?",
    [medicoId]
  );
  if (!medico.length) {
    return res.status(404).json({
      success: false,
      message: "El médico no existe",
    });
  }

  // Verificar y crear historia clínica si no existe
  const historiaExiste = await execute(
    "SELECT id_historia FROM historiasclinicas WHERE id_paciente = ?",
    [pacienteId]
  );

  if (historiaExiste.length === 0) {
    try {
      await execute(
        "INSERT INTO historiasclinicas (id_paciente, fecha_creacion) VALUES (?, CURDATE())",
        [pacienteId]
      );
    } catch (err) {
      console.error("Error creating historia clínica:", err);
      // Continuar aunque falle, el turno se puede crear igual
    }
  }

  // Parsear fecha_turno en formato "YYYY-MM-DD HH:MM:SS" o "YYYY-MM-DD HH:MM"
  let fecha, hora_inicio;
  try {
    const parts = fecha_turno.trim().split(" ");
    if (parts.length < 2) {
      throw new Error("Formato incorrecto - faltan espacios");
    }
    fecha = parts[0]; // YYYY-MM-DD
    const timeParts = parts[1].split(":");
    hora_inicio = `${timeParts[0]}:${timeParts[1]}:00`; // HH:MM:00
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Formato de fecha_turno inválido. Use: YYYY-MM-DD HH:MM",
    });
  }

  // Verificar disponibilidad
  const disponibilidad = await execute(
    `
        SELECT COUNT(*) as disponibles
        FROM disponibilidad_medicos dm
        WHERE id_medico = ?
        AND fecha = ?
    `,
    [medicoId, fecha]
  );

  if (!disponibilidad[0] || disponibilidad[0].disponibles === 0) {
    return res.status(400).json({
      success: false,
      message: "No hay disponibilidad para esta fecha y médico",
    });
  }

  // Crear turno
  const resultado = await execute(
    `
        INSERT INTO turnos (
            id_paciente,
            id_medico,
            fecha,
            hora_inicio,
            estado
        ) VALUES (?, ?, ?, ?, 'Reservado')
    `,
    [pacienteId, medicoId, fecha, hora_inicio]
  );

  if (resultado.affectedRows === 0) {
    return res.status(500).json({
      success: false,
      message: "Error al crear el turno",
    });
  }

  // Eliminar el slot de disponibilidad para que no se pueda reservar de nuevo
  await execute(
    `
        DELETE FROM disponibilidad_medicos 
        WHERE id_medico = ? 
        AND fecha = ? 
        AND hora_inicio = ?
    `,
    [medicoId, fecha, hora_inicio]
  );

  res.status(201).json({
    success: true,
    message: "Turno reservado exitosamente",
    data: {
      id_turno: resultado.insertId,
      id_paciente: pacienteId,
      id_medico: medicoId,
      fecha,
      hora_inicio,
      estado: "Reservado",
    },
  });
});

// Obtener lista de todos los pacientes
const getPacientes = asyncHandler(async (req, res) => {
  const rows = await execute(`
    SELECT 
      pac.id_paciente,
      p.nombre,
      p.apellido,
      p.dni,
      p.email,
      p.telefono
    FROM pacientes pac
    INNER JOIN personas p ON pac.id_persona = p.id_persona
    ORDER BY p.nombre ASC
  `);

  res.json({
    success: true,
    data: rows || [],
  });
});

// Exportar todas las funciones del controlador
// Obtener cirugías del paciente
const getCirugias = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  const cirugias = await execute(
    `
        SELECT 
            c.id_cirugia,
            c.fecha,
            c.hora_inicio,
            c.duracion_estimada,
            c.tipo_cirugia,
            c.diagnostico,
            c.estado,
            CONCAT(p.nombre, ' ', p.apellido) as nombre_medico,
            e.nombre as especialidad,
            q.numero_quirofano,
            q.piso
        FROM cirugias c
        INNER JOIN medicos m ON c.id_medico = m.id_medico
        INNER JOIN personas p ON m.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        LEFT JOIN quirofanos q ON c.id_quirofano = q.id_quirofano
        WHERE c.id_paciente = ?
        ORDER BY c.fecha DESC
    `,
    [id_paciente]
  );

  res.json({
    success: true,
    data: cirugias,
  });
});

module.exports = {
  getDashboardResumen, // Dashboard del paciente
  cancelarTurno, // Gestión de turnos
  getDatosPaciente, // Datos personales
  getHistoriaClinica, // Historia clínica
  actualizarHistoriaClinica, // Actualizar o crear historia clínica
  actualizarDatosPaciente, // Actualización de datos
  getEstudios, // Estudios médicos
  getRecetas, // Recetas médicas
  getConsultas, // Consultas del paciente
  getFacturas, // Facturas del paciente
  getCirugias, // Cirugías del paciente
  // Endpoints para buscar médicos
  getEspecialidades,
  getMedicos,
  getDisponibilidadMedicos,
  reservarTurno,
  getPacientes, // Obtener lista de pacientes
};
