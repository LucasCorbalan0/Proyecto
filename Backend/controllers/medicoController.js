const asyncHandler = require("express-async-handler");
const { execute } = require("../config/database");

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
    data: medicos,
  });
});

const obtenerMedicoPorId = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;

  const medico = await execute(
    `
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
    `,
    [id_medico]
  );

  if (medico.length === 0) {
    res.status(404);
    throw new Error("Médico no encontrado");
  }

  res.json({
    success: true,
    data: medico[0],
  });
});

const crearMedico = asyncHandler(async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    email,
    telefono,
    matricula,
    id_especialidad,
    fecha_nacimiento,
  } = req.body;

  if (!nombre || !apellido || !dni || !matricula || !id_especialidad) {
    res.status(400);
    throw new Error("Por favor complete todos los campos requeridos");
  }

  // Verificar si ya existen
  const datosExistentes = await execute(
    `
        SELECT p.dni, p.email, m.matricula
        FROM medicos m
        LEFT JOIN personas p ON m.id_persona = p.id_persona
        WHERE p.dni = ? OR p.email = ? OR m.matricula = ?
    `,
    [dni, email || null, matricula]
  );

  if (datosExistentes.length > 0) {
    res.status(400);
    if (datosExistentes[0].dni === dni) {
      throw new Error("El DNI ya está registrado");
    } else if (datosExistentes[0].email === email) {
      throw new Error("El email ya está registrado");
    } else {
      throw new Error("La matrícula ya está registrada");
    }
  }

  // Insertar persona
  const resultadoPersona = await execute(
    `
        INSERT INTO personas (nombre, apellido, dni, email, telefono, fecha_nacimiento)
        VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      nombre,
      apellido,
      dni,
      email || null,
      telefono || null,
      fecha_nacimiento || null,
    ]
  );

  // Insertar médico
  const resultadoMedico = await execute(
    `
        INSERT INTO medicos (id_persona, matricula, id_especialidad)
        VALUES (?, ?, ?)
    `,
    [resultadoPersona.insertId, matricula, id_especialidad]
  );

  res.status(201).json({
    success: true,
    mensaje: "Médico creado exitosamente",
    id_medico: resultadoMedico.insertId,
  });
});

const actualizarMedico = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;
  const datosActualizados = req.body;

  // Verificar que el médico existe
  const medicoExiste = await execute(
    "SELECT id_persona FROM medicos WHERE id_medico = ?",
    [id_medico]
  );

  if (medicoExiste.length === 0) {
    res.status(404);
    throw new Error("Médico no encontrado");
  }

  const id_persona = medicoExiste[0].id_persona;

  // Actualizar datos de persona si se proporcionan
  if (
    datosActualizados.nombre ||
    datosActualizados.apellido ||
    datosActualizados.email ||
    datosActualizados.telefono
  ) {
    await execute(
      `
            UPDATE personas 
            SET 
                nombre = COALESCE(?, nombre),
                apellido = COALESCE(?, apellido),
                email = COALESCE(?, email),
                telefono = COALESCE(?, telefono)
            WHERE id_persona = ?
        `,
      [
        datosActualizados.nombre || null,
        datosActualizados.apellido || null,
        datosActualizados.email || null,
        datosActualizados.telefono || null,
        id_persona,
      ]
    );
  }

  // Actualizar datos de médico si se proporcionan
  if (datosActualizados.matricula || datosActualizados.id_especialidad) {
    await execute(
      `
            UPDATE medicos 
            SET 
                matricula = COALESCE(?, matricula),
                id_especialidad = COALESCE(?, id_especialidad)
            WHERE id_medico = ?
        `,
      [
        datosActualizados.matricula || null,
        datosActualizados.id_especialidad || null,
        id_medico,
      ]
    );
  }

  res.json({
    success: true,
    mensaje: "Médico actualizado exitosamente",
  });
});

const eliminarMedico = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;

  const medicoExiste = await execute(
    "SELECT id_persona FROM medicos WHERE id_medico = ?",
    [id_medico]
  );

  if (medicoExiste.length === 0) {
    res.status(404);
    throw new Error("Médico no encontrado");
  }

  const id_persona = medicoExiste[0].id_persona;

  // Eliminar médico
  await execute("DELETE FROM medicos WHERE id_medico = ?", [id_medico]);

  // Eliminar persona
  await execute("DELETE FROM personas WHERE id_persona = ?", [id_persona]);

  res.json({
    success: true,
    mensaje: "Médico eliminado exitosamente",
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
    query += " AND fecha = ?";
    params.push(fecha);
  }

  query += " ORDER BY fecha, hora_inicio";

  const disponibilidad = await execute(query, params);

  res.json({
    success: true,
    data: disponibilidad,
  });
});

const agregarDisponibilidad = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;
  const { fecha, hora_inicio, hora_fin } = req.body;

  if (!fecha || !hora_inicio || !hora_fin) {
    res.status(400);
    throw new Error("Por favor complete todos los campos");
  }

  const resultado = await execute(
    `
        INSERT INTO disponibilidad_medicos (id_medico, fecha, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?)
    `,
    [id_medico, fecha, hora_inicio, hora_fin]
  );

  res.status(201).json({
    success: true,
    mensaje: "Disponibilidad agregada exitosamente",
    id_disponibilidad: resultado.insertId,
  });
});

const eliminarDisponibilidad = asyncHandler(async (req, res) => {
  const { id_disponibilidad } = req.params;

  const resultado = await execute(
    "DELETE FROM disponibilidad_medicos WHERE id_disponibilidad = ?",
    [id_disponibilidad]
  );

  if (resultado.affectedRows === 0) {
    res.status(404);
    throw new Error("Disponibilidad no encontrada");
  }

  res.json({
    success: true,
    mensaje: "Disponibilidad eliminada exitosamente",
  });
});

// ==== NUEVOS ENDPOINTS PARA DASHBOARD ====

// Obtener estadísticas del médico
const obtenerEstadisticas = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;

  // Consultas de hoy
  const consultasHoy = await execute(
    `
        SELECT COUNT(*) as total
        FROM consultas
        WHERE id_medico = ? AND DATE(fecha_consulta) = CURDATE()
    `,
    [id_medico]
  );

  // Consultas pendientes (sin evolucion completada)
  const consultasPendientes = await execute(
    `
        SELECT COUNT(*) as total
        FROM consultas c
        WHERE c.id_medico = ? AND c.id_historia NOT IN (
            SELECT id_historia FROM evoluciones
        )
    `,
    [id_medico]
  );

  // Recetas generadas hoy
  const recetasHoy = await execute(
    `
        SELECT COUNT(*) as total
        FROM recetas
        WHERE id_medico = ? AND DATE(fecha_emision) = CURDATE()
    `,
    [id_medico]
  );

  // Verificar si tiene disponibilidad activa hoy
  const disponibilidadActiva = await execute(
    `
        SELECT COUNT(*) as total
        FROM disponibilidad_medicos
        WHERE id_medico = ? AND fecha = CURDATE()
    `,
    [id_medico]
  );

  res.json({
    success: true,
    data: {
      consultasHoy: consultasHoy[0]?.total || 0,
      consultasPendientes: consultasPendientes[0]?.total || 0,
      recetasGen: recetasHoy[0]?.total || 0,
      disponibilidadActiva: (disponibilidadActiva[0]?.total || 0) > 0,
    },
  });
});

// Obtener turnos en espera del médico
const obtenerTurnosEnEspera = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;

  const turnos = await execute(
    `
        SELECT 
            t.id_turno,
            t.fecha,
            t.hora_inicio,
            t.estado,
            p.id_persona,
            p.nombre as nombre_paciente,
            p.apellido as apellido_paciente,
            p.dni,
            p.telefono,
            pac.id_paciente,
            e.nombre as especialidad
        FROM turnos t
        INNER JOIN medicos m ON t.id_medico = m.id_medico
        INNER JOIN pacientes pac ON t.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE m.id_medico = ? AND t.estado IN ('Reservado', 'En Espera')
        ORDER BY t.fecha, t.hora_inicio
    `,
    [id_medico]
  );

  res.json({
    success: true,
    data: turnos,
  });
});

// Obtener consultas del médico
const obtenerConsultas = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;

  const consultas = await execute(
    `
        SELECT 
            c.id_consulta,
            c.fecha_consulta,
            c.motivo_consulta,
            c.diagnostico,
            c.tratamiento,
            p.id_persona,
            p.nombre as nombre_paciente,
            p.apellido as apellido_paciente,
            p.dni,
            pac.id_paciente,
            h.id_historia,
            (SELECT COUNT(*) FROM evoluciones WHERE id_consulta = c.id_consulta) as total_evoluciones
        FROM consultas c
        INNER JOIN historiasclinicas h ON c.id_historia = h.id_historia
        INNER JOIN pacientes pac ON h.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        WHERE c.id_medico = ?
        ORDER BY c.fecha_consulta DESC
    `,
    [id_medico]
  );

  res.json({
    success: true,
    data: consultas,
  });
});

// Crear nueva consulta
const crearConsulta = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;
  const {
    id_paciente,
    id_historia,
    motivo_consulta,
    diagnostico,
    tratamiento,
  } = req.body;

  // Si no viene id_historia, buscar por id_paciente
  let historia_id = id_historia;

  if (!historia_id && id_paciente) {
    const historia = await execute(
      "SELECT id_historia FROM historiasclinicas WHERE id_paciente = ?",
      [id_paciente]
    );
    if (historia.length === 0) {
      res.status(404);
      throw new Error("No se encontró historia clínica para este paciente");
    }
    historia_id = historia[0].id_historia;
  }

  if (!historia_id || !motivo_consulta) {
    res.status(400);
    throw new Error(
      "id_historia (o id_paciente) y motivo_consulta son requeridos"
    );
  }

  const resultado = await execute(
    `
        INSERT INTO consultas (id_historia, id_medico, fecha_consulta, motivo_consulta, diagnostico, tratamiento)
        VALUES (?, ?, NOW(), ?, ?, ?)
    `,
    [
      historia_id,
      id_medico,
      motivo_consulta,
      diagnostico || null,
      tratamiento || null,
    ]
  );

  res.status(201).json({
    success: true,
    mensaje: "Consulta creada exitosamente",
    id_consulta: resultado.insertId,
  });
});

// Actualizar consulta
const actualizarConsulta = asyncHandler(async (req, res) => {
  const { id_medico, id_consulta } = req.params;
  const { diagnostico, tratamiento } = req.body;

  await execute(
    `
        UPDATE consultas
        SET diagnostico = COALESCE(?, diagnostico),
            tratamiento = COALESCE(?, tratamiento)
        WHERE id_consulta = ? AND id_medico = ?
    `,
    [diagnostico || null, tratamiento || null, id_consulta, id_medico]
  );

  res.json({
    success: true,
    mensaje: "Consulta actualizada exitosamente",
  });
});

// Agregar evolución a consulta
const agregarEvolucion = asyncHandler(async (req, res) => {
  const { id_medico, id_consulta } = req.params;
  const { descripcion, signos_vitales, tratamiento_actual } = req.body;

  if (!descripcion) {
    res.status(400);
    throw new Error("Descripción es requerida");
  }

  const resultado = await execute(
    `
        INSERT INTO evoluciones (id_consulta, fecha, descripcion, signos_vitales, tratamiento_actual)
        VALUES (?, NOW(), ?, ?, ?)
    `,
    [
      id_consulta,
      descripcion,
      signos_vitales || null,
      tratamiento_actual || null,
    ]
  );

  res.status(201).json({
    success: true,
    mensaje: "Evolución agregada exitosamente",
    id_evolucion: resultado.insertId,
  });
});

// Obtener recetas del médico
const obtenerRecetas = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;

  const recetas = await execute(
    `
        SELECT 
            r.id_receta,
            r.fecha_emision,
            p.id_persona,
            p.nombre as nombre_paciente,
            p.apellido as apellido_paciente,
            p.dni,
            pac.id_paciente,
            c.id_consulta,
            (SELECT COUNT(*) FROM recetas_detalle WHERE id_receta = r.id_receta) as total_medicamentos
        FROM recetas r
        INNER JOIN consultas c ON r.id_consulta = c.id_consulta
        INNER JOIN historiasclinicas h ON c.id_historia = h.id_historia
        INNER JOIN pacientes pac ON h.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        WHERE r.id_medico = ?
        ORDER BY r.fecha_emision DESC
    `,
    [id_medico]
  );

  res.json({
    success: true,
    data: recetas,
  });
});

// Crear receta
const crearReceta = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;
  const { id_consulta, medicamentos } = req.body;

  if (!id_consulta || !medicamentos || medicamentos.length === 0) {
    res.status(400);
    throw new Error("id_consulta y medicamentos son requeridos");
  }

  const receta = await execute(
    `
        INSERT INTO recetas (id_consulta, id_medico, fecha_emision)
        VALUES (?, ?, NOW())
    `,
    [id_consulta, id_medico]
  );

  const id_receta = receta.insertId;

  // Insertar medicamentos
  for (const med of medicamentos) {
    await execute(
      `
            INSERT INTO recetas_detalle (id_receta, id_medicamento, dosis, duracion_dias)
            VALUES (?, ?, ?, ?)
        `,
      [id_receta, med.id_medicamento, med.dosis, med.duracion_dias]
    );
  }

  res.status(201).json({
    success: true,
    mensaje: "Receta creada exitosamente",
    id_receta: id_receta,
  });
});

// Obtener detalles de receta
const obtenerDetallesReceta = asyncHandler(async (req, res) => {
  const { id_receta } = req.params;

  const detalles = await execute(
    `
        SELECT 
            rd.id_receta_detalle,
            rd.id_medicamento,
            m.nombre as medicamento,
            m.descripcion,
            m.tipo,
            rd.dosis,
            rd.duracion_dias
        FROM recetas_detalle rd
        INNER JOIN medicamentos m ON rd.id_medicamento = m.id_medicamento
        WHERE rd.id_receta = ?
    `,
    [id_receta]
  );

  res.json({
    success: true,
    data: detalles,
  });
});

// Obtener medicamentos disponibles
const obtenerMedicamentos = asyncHandler(async (req, res) => {
  const medicamentos = await execute(`
        SELECT id_medicamento, nombre_comercial, principio_activo, presentacion
        FROM medicamentos
        ORDER BY nombre_comercial
    `);

  res.json({
    success: true,
    data: medicamentos,
  });
});

// Obtener estudios solicitados
const obtenerEstudios = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;

  const estudios = await execute(
    `
        SELECT 
            e.id_estudio,
            e.fecha_solicitud,
            e.estado,
            e.tipo_estudio,
            e.fecha_resultado,
            p.id_persona,
            p.nombre as nombre_paciente,
            p.apellido as apellido_paciente,
            pac.id_paciente
        FROM estudiosmedicos e
        INNER JOIN pacientes pac ON e.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        WHERE e.id_medico = ?
        ORDER BY e.fecha_solicitud DESC
    `,
    [id_medico]
  );

  res.json({
    success: true,
    data: estudios,
  });
});

// Solicitar estudio
const solicitarEstudio = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;
  const { id_paciente, tipo_estudio } = req.body;

  if (!id_paciente || !tipo_estudio) {
    res.status(400);
    throw new Error("id_paciente y tipo_estudio son requeridos");
  }

  const resultado = await execute(
    `
        INSERT INTO estudiosmedicos (id_medico, id_paciente, tipo_estudio, fecha_solicitud, estado)
        VALUES (?, ?, ?, NOW(), 'Pendiente')
    `,
    [id_medico, id_paciente, tipo_estudio]
  );

  res.status(201).json({
    success: true,
    mensaje: "Estudio solicitado exitosamente",
    id_estudio: resultado.insertId,
  });
});

// Obtener cirugías del médico
const obtenerCirugias = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;

  const cirugias = await execute(
    `
        SELECT 
            c.id_cirugia,
            c.fecha_programada,
            c.estado,
            c.tipo_cirugia,
            p.id_persona,
            p.nombre as nombre_paciente,
            p.apellido as apellido_paciente,
            pac.id_paciente,
            q.nombre as nombre_quirofano
        FROM cirugias c
        INNER JOIN pacientes pac ON c.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        LEFT JOIN quirofanos q ON c.id_quirofano = q.id_quirofano
        WHERE c.id_medico = ?
        ORDER BY c.fecha_programada DESC
    `,
    [id_medico]
  );

  res.json({
    success: true,
    data: cirugias,
  });
});

// Programar cirugía
const programarCirugia = asyncHandler(async (req, res) => {
  const { id_medico } = req.params;
  const { id_paciente, id_quirofano, fecha_programada, tipo_cirugia } =
    req.body;

  if (!id_paciente || !id_quirofano || !fecha_programada || !tipo_cirugia) {
    res.status(400);
    throw new Error(
      "id_paciente, id_quirofano, fecha_programada y tipo_cirugia son requeridos"
    );
  }

  // Verificar disponibilidad del quirófano
  const quirofanoOcupado = await execute(
    `
        SELECT COUNT(*) as total
        FROM cirugias
        WHERE id_quirofano = ? 
        AND DATE(fecha_programada) = ?
        AND estado != 'Cancelada'
    `,
    [id_quirofano, fecha_programada]
  );

  if (quirofanoOcupado[0]?.total > 0) {
    res.status(400);
    throw new Error("El quirófano no está disponible en ese horario");
  }

  const resultado = await execute(
    `
        INSERT INTO cirugias (id_medico, id_paciente, id_quirofano, fecha_programada, estado, tipo_cirugia)
        VALUES (?, ?, ?, ?, 'Programada', ?)
    `,
    [id_medico, id_paciente, id_quirofano, fecha_programada, tipo_cirugia]
  );

  res.status(201).json({
    success: true,
    mensaje: "Cirugía programada exitosamente",
    id_cirugia: resultado.insertId,
  });
});

// Obtener quirófanos disponibles
const obtenerQuirofanos = asyncHandler(async (req, res) => {
  const quirofanos = await execute(`
        SELECT id_quirofano, nombre, estado
        FROM quirofanos
        ORDER BY nombre
    `);

  res.json({
    success: true,
    data: quirofanos,
  });
});

// Actualizar disponibilidad
const actualizarDisponibilidad = asyncHandler(async (req, res) => {
  const { id_disponibilidad } = req.params;
  const { hora_inicio, hora_fin } = req.body;

  if (!hora_inicio || !hora_fin) {
    res.status(400);
    throw new Error("hora_inicio y hora_fin son requeridos");
  }

  await execute(
    `
        UPDATE disponibilidad_medicos
        SET hora_inicio = ?, hora_fin = ?
        WHERE id_disponibilidad = ?
    `,
    [hora_inicio, hora_fin, id_disponibilidad]
  );

  res.json({
    success: true,
    mensaje: "Disponibilidad actualizada exitosamente",
  });
});

// Obtener historial clínico completo de un paciente
const obtenerHistorialClinico = asyncHandler(async (req, res) => {
  const { id_paciente } = req.params;

  // Datos base de historia clínica
  const historia = await execute(
    `
        SELECT 
            h.id_historia,
            h.id_paciente,
            h.fecha_creacion,
            h.tipo_sangre,
            h.factor_rh,
            h.alergias_conocidas,
            h.comorbilidades_cronicas,
            h.medicacion_habitual,
            h.antecedentes_quirurgicos,
            h.contacto_emergencia_nombre,
            h.contacto_emergencia_telefono,
            p.nombre,
            p.apellido,
            p.dni,
            p.email,
            p.telefono,
            p.fecha_nacimiento
        FROM historiasclinicas h
        INNER JOIN pacientes pac ON h.id_paciente = pac.id_paciente
        INNER JOIN personas p ON pac.id_persona = p.id_persona
        WHERE h.id_paciente = ?
    `,
    [id_paciente]
  );

  if (historia.length === 0) {
    res.status(404);
    throw new Error("Historia clínica no encontrada para este paciente");
  }

  const datosBasicos = historia[0];

  // Consultas asociadas
  const consultas = await execute(
    `
        SELECT 
            c.id_consulta,
            c.fecha_consulta,
            c.motivo_consulta,
            c.diagnostico,
            c.tratamiento,
            m.id_medico,
            p_med.nombre as nombre_medico,
            p_med.apellido as apellido_medico
        FROM consultas c
        INNER JOIN medicos m ON c.id_medico = m.id_medico
        INNER JOIN personas p_med ON m.id_persona = p_med.id_persona
        WHERE c.id_historia = ?
        ORDER BY c.fecha_consulta DESC
    `,
    [datosBasicos.id_historia]
  );

  // Recetas asociadas - por historia clínica
  const recetas = await execute(
    `
        SELECT 
            r.id_receta,
            r.fecha_emision,
            m.id_medico,
            p_med.nombre as nombre_medico,
            p_med.apellido as apellido_medico,
            (SELECT COUNT(*) FROM recetas_detalle WHERE id_receta = r.id_receta) as total_medicamentos
        FROM recetas r
        INNER JOIN consultas c ON r.id_consulta = c.id_consulta
        INNER JOIN medicos m ON r.id_medico = m.id_medico
        INNER JOIN personas p_med ON m.id_persona = p_med.id_persona
        WHERE c.id_historia = ?
        ORDER BY r.fecha_emision DESC
    `,
    [datosBasicos.id_historia]
  );

  // Estudios solicitados
  const estudios = await execute(
    `
        SELECT 
            e.id_estudio,
            e.fecha_solicitud,
            e.tipo_estudio,
            e.estado,
            e.fecha_resultado,
            m.id_medico,
            p_med.nombre as nombre_medico,
            p_med.apellido as apellido_medico
        FROM estudiosmedicos e
        INNER JOIN medicos m ON e.id_medico = m.id_medico
        INNER JOIN personas p_med ON m.id_persona = p_med.id_persona
        WHERE e.id_paciente = ?
        ORDER BY e.fecha_solicitud DESC
    `,
    [id_paciente]
  );

  // Cirugías realizadas
  const cirugias = await execute(
    `
        SELECT 
            c.id_cirugia,
            c.fecha_programada,
            c.tipo_cirugia,
            c.estado,
            m.id_medico,
            p_med.nombre as nombre_medico,
            p_med.apellido as apellido_medico,
            q.nombre as nombre_quirofano
        FROM cirugias c
        INNER JOIN medicos m ON c.id_medico = m.id_medico
        INNER JOIN personas p_med ON m.id_persona = p_med.id_persona
        LEFT JOIN quirofanos q ON c.id_quirofano = q.id_quirofano
        WHERE c.id_paciente = ?
        ORDER BY c.fecha_programada DESC
    `,
    [id_paciente]
  );

  res.json({
    success: true,
    data: {
      datosBasicos,
      consultas,
      recetas,
      estudios,
      cirugias,
    },
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
  eliminarDisponibilidad,
  obtenerEstadisticas,
  obtenerTurnosEnEspera,
  obtenerConsultas,
  crearConsulta,
  actualizarConsulta,
  agregarEvolucion,
  obtenerRecetas,
  crearReceta,
  obtenerDetallesReceta,
  obtenerMedicamentos,
  obtenerEstudios,
  solicitarEstudio,
  obtenerCirugias,
  programarCirugia,
  obtenerQuirofanos,
  actualizarDisponibilidad,
  obtenerHistorialClinico,
};
