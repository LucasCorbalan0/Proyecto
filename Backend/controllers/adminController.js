const asyncHandler = require("express-async-handler");
const { execute } = require("../config/database");
const bcrypt = require("bcryptjs");

// Usamos asynchandler para manejar errores de forma automatica
const obtenerUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await execute(`
        SELECT
            u.id_usuario,
            u.nombre_usuario,
            u.activo,
            p.nombre,
            p.apellido,
            p.dni,
            p.email,
            p.telefono,
            p.fecha_nacimiento,
            p.genero,
            p.direccion,
            r.nombre as rol
        FROM
            usuarios u
        JOIN
            personas p ON u.id_persona = p.id_persona
        JOIN
            rolessistema r ON u.id_rol_sistema = r.id_rol_sistema
        ORDER BY 
            u.id_usuario DESC
    `);

  res.json({
    success: true,
    total: usuarios.length,
    data: usuarios,
  });
});

const crearUsuario = asyncHandler(async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    email,
    fecha_nacimiento,
    telefono,
    nombre_usuario,
    password,
    id_rol_sistema,
    genero,
    direccion,
  } = req.body;

  //Validar datos
  if (
    !nombre ||
    !apellido ||
    !dni ||
    !nombre_usuario ||
    !password ||
    !id_rol_sistema
  ) {
    res.status(400);
    throw new Error("Por favor complete todos los campos requeridos");
  }

  // Verificar si ya existen
  const datosExistentes = await execute(
    `
        SELECT u.nombre_usuario, p.dni, p.email
        FROM usuarios u
        LEFT JOIN personas p ON p.id_persona = u.id_persona
        WHERE u.nombre_usuario = ? OR p.dni = ? OR (p.email = ? AND p.email IS NOT NULL)
    `,
    [nombre_usuario, dni, email || null]
  );

  if (datosExistentes.length > 0) {
    res.status(400);
    if (datosExistentes[0].nombre_usuario === nombre_usuario) {
      throw new Error("El nombre de usuario ya está registrado");
    } else if (datosExistentes[0].dni === dni) {
      throw new Error("El DNI ya está registrado");
    } else {
      throw new Error("El email ya está registrado");
    }
  }

  // Encriptar contraseña
  const salt = await bcrypt.genSalt(10);
  const passwordEncriptada = await bcrypt.hash(password, salt);

  // Insertar persona
  const resultadoPersona = await execute(
    `
        INSERT INTO personas (
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            email,
            telefono,
            genero,
            direccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      nombre,
      apellido,
      dni,
      fecha_nacimiento || null,
      email || null,
      telefono || null,
      genero || null,
      direccion || null,
    ]
  );

  // Insertar usuario
  const resultadoUsuario = await execute(
    `
        INSERT INTO usuarios (
            id_persona,
            nombre_usuario,
            password,
            id_rol_sistema
        ) VALUES (?, ?, ?, ?)
    `,
    [
      resultadoPersona.insertId,
      nombre_usuario,
      passwordEncriptada,
      id_rol_sistema,
    ]
  );

  res.status(201).json({
    success: true,
    mensaje: "Usuario creado exitosamente",
    id_usuario: resultadoUsuario.insertId,
  });
});

const actualizarUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  // Verificar si el usuario existe
  const usuarioExiste = await execute(
    "SELECT id_persona FROM usuarios WHERE id_usuario = ?",
    [id]
  );

  if (usuarioExiste.length === 0) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  const id_persona = usuarioExiste[0].id_persona;

  // Actualizar datos personales
  if (
    datosActualizados.nombre ||
    datosActualizados.apellido ||
    datosActualizados.email ||
    datosActualizados.telefono ||
    datosActualizados.genero ||
    datosActualizados.direccion
  ) {
    await execute(
      `
            UPDATE personas 
            SET 
                nombre = COALESCE(?, nombre),
                apellido = COALESCE(?, apellido),
                email = COALESCE(?, email),
                telefono = COALESCE(?, telefono),
                genero = COALESCE(?, genero),
                direccion = COALESCE(?, direccion)
            WHERE id_persona = ?
        `,
      [
        datosActualizados.nombre || null,
        datosActualizados.apellido || null,
        datosActualizados.email || null,
        datosActualizados.telefono || null,
        datosActualizados.genero || null,
        datosActualizados.direccion || null,
        id_persona,
      ]
    );
  }

  // Actualizar datos de usuario
  if (datosActualizados.nombre_usuario || datosActualizados.id_rol_sistema) {
    await execute(
      `
            UPDATE usuarios 
            SET 
                nombre_usuario = COALESCE(?, nombre_usuario),
                id_rol_sistema = COALESCE(?, id_rol_sistema)
            WHERE id_usuario = ?
        `,
      [
        datosActualizados.nombre_usuario || null,
        datosActualizados.id_rol_sistema || null,
        id,
      ]
    );
  }

  res.json({
    success: true,
    mensaje: "Usuario actualizado exitosamente",
  });
});

const cambiarEstadoUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usuario = await execute(
    "SELECT activo FROM usuarios WHERE id_usuario = ?",
    [id]
  );

  if (usuario.length === 0) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  const nuevoEstado = usuario[0].activo === 1 ? 0 : 1;
  await execute("UPDATE usuarios SET activo = ? WHERE id_usuario = ?", [
    nuevoEstado,
    id,
  ]);

  res.json({
    success: true,
    mensaje: `Estado del usuario actualizado a ${
      nuevoEstado === 1 ? "Activo" : "Desactivado"
    }`,
    nuevoEstado: nuevoEstado === 1,
  });
});

const eliminarUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Obtener id_persona del usuario
  const usuario = await execute(
    "SELECT id_persona FROM usuarios WHERE id_usuario = ?",
    [id]
  );

  if (usuario.length === 0) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  const id_persona = usuario[0].id_persona;

  // Eliminar usuario
  await execute("DELETE FROM usuarios WHERE id_usuario = ?", [id]);

  // Eliminar persona
  await execute("DELETE FROM personas WHERE id_persona = ?", [id_persona]);

  res.json({
    success: true,
    mensaje: "Usuario eliminado exitosamente",
  });
});

// Dashboard general del admin
const getDashboardAdmin = asyncHandler(async (req, res) => {
  try {
    // Obtener total de usuarios
    const usuarios = await execute("SELECT COUNT(*) as total FROM usuarios");
    const totalUsuarios = usuarios[0]?.total || 0;

    // Obtener ocupación de camas (simplificado - contar camas ocupadas)
    const camas = await execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN estado = 'Ocupada' THEN 1 ELSE 0 END) as ocupadas
            FROM camas
        `);
    const ocupacion =
      camas[0]?.total > 0
        ? Math.round((camas[0]?.ocupadas / camas[0]?.total) * 100)
        : 0;

    // Obtener total productos
    const stockBajo = await execute(`
            SELECT COUNT(*) as total 
            FROM productos
        `);

    // Obtener facturas pendientes
    const facturasPendientes = await execute(`
            SELECT COUNT(*) as total 
            FROM facturacion 
            WHERE estado_pago = 'Pendiente'
        `);

    // Actividad reciente (últimas auditorías)
    const actividades = await execute(`
            SELECT a.accion as titulo, a.fecha as subtitulo
            FROM auditorias a
            ORDER BY a.fecha DESC
            LIMIT 3
        `);

    res.json({
      success: true,
      data: {
        totalUsuarios,
        ocupacion,
        stockBajo: stockBajo[0]?.total || 0,
        factPendientes: facturasPendientes[0]?.total || 0,
        actividadReciente: actividades.map((a) => ({
          tipo: "actividad",
          titulo: a.titulo,
          subtitulo: a.subtitulo,
        })),
      },
    });
  } catch (error) {
    console.error("Error en getDashboardAdmin:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener dashboard",
    });
  }
});

// 1. PRODUCTOS
const getProductos = asyncHandler(async (req, res) => {
  try {
    const productos = await execute(`
            SELECT id_producto, nombre, descripcion, tipo_producto
            FROM productos
            ORDER BY nombre
        `);

    res.json({
      success: true,
      data: productos,
    });
  } catch (error) {
    console.error("Error en getProductos:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener productos" });
  }
});

const createProducto = asyncHandler(async (req, res) => {
  const { nombre, descripcion, tipo_producto } = req.body;

  if (!nombre || nombre.trim() === "") {
    res.status(400);
    throw new Error("El nombre del producto es requerido");
  }

  if (nombre.trim().length < 3) {
    res.status(400);
    throw new Error("El nombre debe tener al menos 3 caracteres");
  }

  if (!tipo_producto) {
    res.status(400);
    throw new Error("El tipo de producto es requerido");
  }

  const result = await execute(
    `
        INSERT INTO productos (nombre, descripcion, tipo_producto)
        VALUES (?, ?, ?)
    `,
    [nombre.trim(), descripcion ? descripcion.trim() : null, tipo_producto]
  );

  res.status(201).json({
    success: true,
    id_producto: result.insertId,
    message: "Producto creado correctamente",
  });
});

const updateProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo_producto } = req.body;

  if (nombre && nombre.trim().length < 3) {
    res.status(400);
    throw new Error("El nombre debe tener al menos 3 caracteres");
  }

  await execute(
    `
        UPDATE productos
        SET nombre = COALESCE(?, nombre),
            descripcion = COALESCE(?, descripcion),
            tipo_producto = COALESCE(?, tipo_producto)
        WHERE id_producto = ?
    `,
    [
      nombre ? nombre.trim() : null,
      descripcion ? descripcion.trim() : null,
      tipo_producto || null,
      id,
    ]
  );

  res.json({ success: true, message: "Producto actualizado correctamente" });
});

const deleteProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await execute("DELETE FROM productos WHERE id_producto = ?", [
    id,
  ]);

  if (result.affectedRows === 0) {
    res.status(404);
    throw new Error("Producto no encontrado");
  }

  res.json({ success: true, message: "Producto eliminado correctamente" });
});

// 2. COMPRAS
const getCompras = asyncHandler(async (req, res) => {
  try {
    const compras = await execute(`
            SELECT 
                c.id_compra,
                pr.nombre as proveedor,
                c.fecha_pedido,
                c.estado,
                COUNT(cd.id_compra_detalle) as items,
                SUM(cd.cantidad * cd.precio_unitario) as total
            FROM compras c
            JOIN proveedores pr ON c.id_proveedor = pr.id_proveedor
            LEFT JOIN compras_detalle cd ON c.id_compra = cd.id_compra
            GROUP BY c.id_compra
            ORDER BY c.fecha_pedido DESC
        `);

    res.json({ success: true, data: compras });
  } catch (error) {
    console.error("Error en getCompras:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener compras" });
  }
});

const createCompra = asyncHandler(async (req, res) => {
  const { id_proveedor, estado } = req.body;

  if (!id_proveedor) {
    res.status(400);
    throw new Error("El proveedor es requerido");
  }

  const result = await execute(
    `
        INSERT INTO compras (id_proveedor, estado)
        VALUES (?, ?)
    `,
    [id_proveedor, estado || "Pendiente"]
  );

  res.status(201).json({ success: true, id_compra: result.insertId });
});

// 3. PRESTACIONES
const getPrestaciones = asyncHandler(async (req, res) => {
  try {
    const prestaciones = await execute(`
            SELECT id_prestacion, descripcion, precio
            FROM prestaciones
            ORDER BY descripcion
        `);

    res.json({ success: true, data: prestaciones });
  } catch (error) {
    console.error("Error en getPrestaciones:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener prestaciones" });
  }
});

const createPrestacion = asyncHandler(async (req, res) => {
  const { descripcion, precio } = req.body;

  if (!descripcion || !precio) {
    res.status(400);
    throw new Error("Descripción y precio son requeridos");
  }

  const result = await execute(
    `
        INSERT INTO prestaciones (descripcion, precio)
        VALUES (?, ?)
    `,
    [descripcion, precio]
  );

  res.status(201).json({ success: true, id_prestacion: result.insertId });
});

const updatePrestacion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { descripcion, precio } = req.body;

  await execute(
    `
        UPDATE prestaciones
        SET descripcion = COALESCE(?, descripcion),
            precio = COALESCE(?, precio)
        WHERE id_prestacion = ?
    `,
    [descripcion, precio, id]
  );

  res.json({ success: true, message: "Prestación actualizada" });
});

const deletePrestacion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await execute("DELETE FROM prestaciones WHERE id_prestacion = ?", [id]);
  res.json({ success: true, message: "Prestación eliminada" });
});

// 4. FACTURACION
const getFacturas = asyncHandler(async (req, res) => {
  try {
    const facturas = await execute(`
            SELECT 
                f.id_factura,
                CONCAT(p.nombre, ' ', p.apellido) as paciente,
                f.fecha_emision,
                f.total,
                f.estado_pago
            FROM facturacion f
            JOIN pacientes pac ON f.id_paciente = pac.id_paciente
            JOIN personas p ON pac.id_persona = p.id_persona
            ORDER BY f.fecha_emision DESC
        `);

    res.json({ success: true, data: facturas });
  } catch (error) {
    console.error("Error en getFacturas:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener facturas" });
  }
});

// 5. REPORTES
const getReportes = asyncHandler(async (req, res) => {
  try {
    // Estadísticas generales
    const stats = await execute(`
            SELECT 
                (SELECT COUNT(*) FROM usuarios) as totalUsuarios,
                (SELECT COUNT(*) FROM pacientes) as totalPacientes,
                (SELECT COUNT(*) FROM medicos) as totalMedicos,
                (SELECT COUNT(*) FROM camas WHERE estado = 'Ocupada') as camasOcupadas,
                (SELECT SUM(total) FROM facturacion WHERE estado_pago = 'Pagada') as totalRecaudado,
                (SELECT SUM(total) FROM facturacion WHERE estado_pago = 'Pendiente') as totalPendiente
        `);

    res.json({ success: true, data: stats[0] || {} });
  } catch (error) {
    console.error("Error en getReportes:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener reportes" });
  }
});

// 6. AUDITORIAS
const getAuditorias = asyncHandler(async (req, res) => {
  try {
    const auditorias = await execute(`
            SELECT 
                a.id_auditoria,
                CONCAT(p.nombre, ' ', p.apellido) as usuario,
                a.accion,
                a.fecha
            FROM auditorias a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
            JOIN personas p ON u.id_persona = p.id_persona
            ORDER BY a.fecha DESC
            LIMIT 100
        `);

    res.json({ success: true, data: auditorias });
  } catch (error) {
    console.error("Error en getAuditorias:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener auditorías" });
  }
});

// 7. ESPECIALIDADES
const getEspecialidades = asyncHandler(async (req, res) => {
  try {
    const especialidades = await execute(`
            SELECT id_especialidad, nombre, es_quirurgica
            FROM especialidades
            ORDER BY nombre
        `);

    res.json({ success: true, data: especialidades });
  } catch (error) {
    console.error("Error en getEspecialidades:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener especialidades" });
  }
});

const createEspecialidad = asyncHandler(async (req, res) => {
  const { nombre, es_quirurgica } = req.body;

  if (!nombre) {
    res.status(400);
    throw new Error("El nombre es requerido");
  }

  const result = await execute(
    `
        INSERT INTO especialidades (nombre, es_quirurgica)
        VALUES (?, ?)
    `,
    [nombre, es_quirurgica ? 1 : 0]
  );

  res.status(201).json({ success: true, id_especialidad: result.insertId });
});

const updateEspecialidad = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, es_quirurgica } = req.body;

  await execute(
    `
        UPDATE especialidades
        SET nombre = COALESCE(?, nombre),
            es_quirurgica = COALESCE(?, es_quirurgica)
        WHERE id_especialidad = ?
    `,
    [nombre, es_quirurgica, id]
  );

  res.json({ success: true, message: "Especialidad actualizada" });
});

const deleteEspecialidad = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await execute("DELETE FROM especialidades WHERE id_especialidad = ?", [id]);
  res.json({ success: true, message: "Especialidad eliminada" });
});

// 9. MEDICOS
const getMedicos = asyncHandler(async (req, res) => {
  try {
    const medicos = await execute(`
            SELECT 
                m.id_medico,
                p.nombre,
                p.apellido,
                p.dni,
                p.telefono,
                p.email,
                m.matricula,
                e.nombre as especialidad
            FROM medicos m
            JOIN personas p ON m.id_persona = p.id_persona
            JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            ORDER BY p.apellido, p.nombre
        `);

    res.json({ success: true, data: medicos });
  } catch (error) {
    console.error("Error en getMedicos:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener médicos" });
  }
});

const createMedico = asyncHandler(async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    fecha_nacimiento,
    genero,
    direccion,
    telefono,
    email,
    matricula,
    id_especialidad,
    nombre_usuario,
    password,
  } = req.body;

  if (
    !nombre ||
    !apellido ||
    !dni ||
    !matricula ||
    !id_especialidad ||
    !nombre_usuario ||
    !password
  ) {
    res.status(400);
    throw new Error(
      "Faltan datos requeridos (nombre, apellido, dni, matricula, id_especialidad, nombre_usuario, password)"
    );
  }

  try {
    // Validar que nombre_usuario no exista
    const existeUsuario = await execute(
      "SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?",
      [nombre_usuario]
    );
    if (existeUsuario.length > 0) {
      res.status(400);
      throw new Error("El nombre de usuario ya existe");
    }

    // Validar que DNI no exista
    const existeDni = await execute(
      "SELECT id_persona FROM personas WHERE dni = ?",
      [dni]
    );
    if (existeDni.length > 0) {
      res.status(400);
      throw new Error("El DNI ya existe");
    }

    // Usar fecha de nacimiento proporcionada o una por defecto
    const fechaNacimiento = fecha_nacimiento || "1980-01-01";

    // Crear persona
    const personaResult = await execute(
      `
            INSERT INTO personas (dni, nombre, apellido, fecha_nacimiento, genero, direccion, telefono, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        dni,
        nombre,
        apellido,
        fechaNacimiento,
        genero || null,
        direccion || null,
        telefono || null,
        email || null,
      ]
    );

    const id_persona = personaResult.insertId;

    // Crear médico
    await execute(
      `
            INSERT INTO medicos (id_persona, matricula, id_especialidad)
            VALUES (?, ?, ?)
        `,
      [id_persona, matricula, id_especialidad]
    );

    // Crear usuario para login
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const id_rol_sistema = 4; // MEDICO
    await execute(
      `
            INSERT INTO usuarios (id_persona, nombre_usuario, password, id_rol_sistema, activo)
            VALUES (?, ?, ?, ?, 1)
        `,
      [id_persona, nombre_usuario, passwordEncriptada, id_rol_sistema]
    );

    res.json({
      success: true,
      message: "Médico y usuario creados exitosamente",
    });
  } catch (error) {
    console.error("Error en createMedico:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error al crear médico",
      });
  }
});

const updateMedico = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, email, matricula, id_especialidad } =
    req.body;

  try {
    // Obtener id_persona del médico
    const medico = await execute(
      "SELECT id_persona FROM medicos WHERE id_medico = ?",
      [id]
    );
    if (!medico.length) {
      res.status(404);
      throw new Error("Médico no encontrado");
    }

    const id_persona = medico[0].id_persona;

    // Actualizar persona
    if (nombre || apellido || telefono || email) {
      await execute(
        `
                UPDATE personas
                SET nombre = COALESCE(?, nombre),
                    apellido = COALESCE(?, apellido),
                    telefono = COALESCE(?, telefono),
                    email = COALESCE(?, email)
                WHERE id_persona = ?
            `,
        [nombre, apellido, telefono, email, id_persona]
      );
    }

    // Actualizar médico
    if (matricula || id_especialidad) {
      await execute(
        `
                UPDATE medicos
                SET matricula = COALESCE(?, matricula),
                    id_especialidad = COALESCE(?, id_especialidad)
                WHERE id_medico = ?
            `,
        [matricula, id_especialidad, id]
      );
    }

    res.json({ success: true, message: "Médico actualizado" });
  } catch (error) {
    console.error("Error en updateMedico:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const deleteMedico = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const medico = await execute(
      "SELECT id_persona FROM medicos WHERE id_medico = ?",
      [id]
    );
    if (!medico.length) {
      res.status(404);
      throw new Error("Médico no encontrado");
    }

    await execute("DELETE FROM medicos WHERE id_medico = ?", [id]);
    res.json({ success: true, message: "Médico eliminado" });
  } catch (error) {
    console.error("Error en deleteMedico:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 10. PACIENTES
const getPacientes = asyncHandler(async (req, res) => {
  try {
    const pacientes = await execute(`
            SELECT 
                pac.id_paciente,
                p.nombre,
                p.apellido,
                p.dni,
                p.fecha_nacimiento,
                p.genero,
                p.telefono,
                p.email,
                p.direccion
            FROM pacientes pac
            JOIN personas p ON pac.id_persona = p.id_persona
            ORDER BY p.apellido, p.nombre
        `);

    res.json({ success: true, data: pacientes });
  } catch (error) {
    console.error("Error en getPacientes:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener pacientes" });
  }
});

const createPaciente = asyncHandler(async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    direccion,
    nombre_usuario,
    password,
  } = req.body;

  if (!nombre || !apellido || !dni || !nombre_usuario || !password) {
    res.status(400);
    throw new Error(
      "Faltan datos requeridos (nombre, apellido, dni, nombre_usuario, password)"
    );
  }

  try {
    // Validar que nombre_usuario no exista
    const existeUsuario = await execute(
      "SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?",
      [nombre_usuario]
    );
    if (existeUsuario.length > 0) {
      res.status(400);
      throw new Error("El nombre de usuario ya existe");
    }

    // Validar que DNI no exista
    const existeDni = await execute(
      "SELECT id_persona FROM personas WHERE dni = ?",
      [dni]
    );
    if (existeDni.length > 0) {
      res.status(400);
      throw new Error("El DNI ya existe");
    }

    // Crear persona
    const personaResult = await execute(
      `
            INSERT INTO personas (dni, nombre, apellido, fecha_nacimiento, genero, telefono, email, direccion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        dni,
        nombre,
        apellido,
        fecha_nacimiento || "1980-01-01",
        genero || null,
        telefono || null,
        email || null,
        direccion || null,
      ]
    );

    const id_persona = personaResult.insertId;

    // Crear paciente
    await execute(
      `
            INSERT INTO pacientes (id_persona)
            VALUES (?)
        `,
      [id_persona]
    );

    // Crear usuario para login
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const id_rol_sistema = 6; // PACIENTE
    await execute(
      `
            INSERT INTO usuarios (id_persona, nombre_usuario, password, id_rol_sistema, activo)
            VALUES (?, ?, ?, ?, 1)
        `,
      [id_persona, nombre_usuario, passwordEncriptada, id_rol_sistema]
    );

    res.json({
      success: true,
      message: "Paciente y usuario creados exitosamente",
    });
  } catch (error) {
    console.error("Error en createPaciente:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error al crear paciente",
      });
  }
});

const updatePaciente = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    direccion,
  } = req.body;

  try {
    // Obtener id_persona del paciente
    const paciente = await execute(
      "SELECT id_persona FROM pacientes WHERE id_paciente = ?",
      [id]
    );
    if (!paciente.length) {
      res.status(404);
      throw new Error("Paciente no encontrado");
    }

    const id_persona = paciente[0].id_persona;

    // Actualizar persona
    await execute(
      `
            UPDATE personas
            SET nombre = COALESCE(?, nombre),
                apellido = COALESCE(?, apellido),
                fecha_nacimiento = COALESCE(?, fecha_nacimiento),
                genero = COALESCE(?, genero),
                telefono = COALESCE(?, telefono),
                email = COALESCE(?, email),
                direccion = COALESCE(?, direccion)
            WHERE id_persona = ?
        `,
      [
        nombre,
        apellido,
        fecha_nacimiento,
        genero,
        telefono,
        email,
        direccion,
        id_persona,
      ]
    );

    res.json({ success: true, message: "Paciente actualizado" });
  } catch (error) {
    console.error("Error en updatePaciente:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const deletePaciente = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await execute(
      "SELECT id_persona FROM pacientes WHERE id_paciente = ?",
      [id]
    );
    if (!paciente.length) {
      res.status(404);
      throw new Error("Paciente no encontrado");
    }

    await execute("DELETE FROM pacientes WHERE id_paciente = ?", [id]);
    res.json({ success: true, message: "Paciente eliminado" });
  } catch (error) {
    console.error("Error en deletePaciente:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// ENFERMEROS
// ============================================================================
const getEnfermeros = asyncHandler(async (req, res) => {
  try {
    const enfermeros = await execute(`
            SELECT 
                e.id_enfermero,
                p.id_persona,
                p.dni,
                p.nombre,
                p.apellido,
                p.email,
                p.telefono,
                e.matricula
            FROM enfermeros e
            JOIN personas p ON e.id_persona = p.id_persona
            ORDER BY p.apellido, p.nombre
        `);

    res.json({ success: true, data: enfermeros });
  } catch (error) {
    console.error("Error en getEnfermeros:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const createEnfermero = asyncHandler(async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    fecha_nacimiento,
    genero,
    direccion,
    telefono,
    email,
    matricula,
    nombre_usuario,
    password,
  } = req.body;

  if (!nombre || !apellido || !dni || !nombre_usuario || !password) {
    res.status(400);
    throw new Error(
      "Faltan datos requeridos (nombre, apellido, dni, nombre_usuario, password)"
    );
  }

  try {
    // Validar que nombre_usuario no exista
    const existeUsuario = await execute(
      "SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?",
      [nombre_usuario]
    );
    if (existeUsuario.length > 0) {
      res.status(400);
      throw new Error("El nombre de usuario ya existe");
    }

    // Validar que DNI no exista
    const existeDni = await execute(
      "SELECT id_persona FROM personas WHERE dni = ?",
      [dni]
    );
    if (existeDni.length > 0) {
      res.status(400);
      throw new Error("El DNI ya existe");
    }

    // Usar fecha de nacimiento proporcionada o una por defecto
    const fechaNacimiento = fecha_nacimiento || "1980-01-01";

    // Crear persona
    const personaResult = await execute(
      `
            INSERT INTO personas (dni, nombre, apellido, fecha_nacimiento, genero, direccion, telefono, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        dni,
        nombre,
        apellido,
        fechaNacimiento,
        genero || null,
        direccion || null,
        telefono || null,
        email || null,
      ]
    );

    const id_persona = personaResult.insertId;

    // Crear enfermero
    await execute(
      `
            INSERT INTO enfermeros (id_persona, matricula)
            VALUES (?, ?)
        `,
      [id_persona, matricula || null]
    );

    // Crear usuario para login
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const id_rol_sistema = 5; // ENFERMERO
    await execute(
      `
            INSERT INTO usuarios (id_persona, nombre_usuario, password, id_rol_sistema, activo)
            VALUES (?, ?, ?, ?, 1)
        `,
      [id_persona, nombre_usuario, passwordEncriptada, id_rol_sistema]
    );

    res.json({
      success: true,
      message: "Enfermero y usuario creados exitosamente",
    });
  } catch (error) {
    console.error("Error en createEnfermero:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error al crear enfermero",
      });
  }
});

const updateEnfermero = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, email, matricula } = req.body;

  try {
    // Obtener id_persona del enfermero
    const enfermero = await execute(
      "SELECT id_persona FROM enfermeros WHERE id_enfermero = ?",
      [id]
    );
    if (!enfermero.length) {
      res.status(404);
      throw new Error("Enfermero no encontrado");
    }

    const id_persona = enfermero[0].id_persona;

    // Actualizar persona
    if (nombre || apellido || telefono || email) {
      await execute(
        `
                UPDATE personas
                SET nombre = COALESCE(?, nombre),
                    apellido = COALESCE(?, apellido),
                    telefono = COALESCE(?, telefono),
                    email = COALESCE(?, email)
                WHERE id_persona = ?
            `,
        [nombre, apellido, telefono, email, id_persona]
      );
    }

    // Actualizar enfermero
    if (matricula) {
      await execute(
        `
                UPDATE enfermeros
                SET matricula = COALESCE(?, matricula)
                WHERE id_enfermero = ?
            `,
        [matricula, id]
      );
    }

    res.json({ success: true, message: "Enfermero actualizado" });
  } catch (error) {
    console.error("Error en updateEnfermero:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const deleteEnfermero = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const enfermero = await execute(
      "SELECT id_persona FROM enfermeros WHERE id_enfermero = ?",
      [id]
    );
    if (!enfermero.length) {
      res.status(404);
      throw new Error("Enfermero no encontrado");
    }

    const id_persona = enfermero[0].id_persona;

    // Eliminar enfermero
    await execute("DELETE FROM enfermeros WHERE id_enfermero = ?", [id]);

    // Eliminar persona
    await execute("DELETE FROM personas WHERE id_persona = ?", [id_persona]);

    res.json({ success: true, message: "Enfermero eliminado" });
  } catch (error) {
    console.error("Error en deleteEnfermero:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// RECEPCIONISTAS
// ============================================================================
const getRecepcionistas = asyncHandler(async (req, res) => {
  try {
    const recepcionistas = await execute(`
            SELECT 
                r.id_recepcionista,
                p.id_persona,
                p.dni,
                p.nombre,
                p.apellido,
                p.email,
                p.telefono
            FROM recepcionistas r
            JOIN personas p ON r.id_persona = p.id_persona
            ORDER BY p.apellido, p.nombre
        `);

    res.json({ success: true, data: recepcionistas });
  } catch (error) {
    console.error("Error en getRecepcionistas:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const createRecepcionista = asyncHandler(async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    fecha_nacimiento,
    genero,
    direccion,
    telefono,
    email,
    nombre_usuario,
    password,
  } = req.body;

  if (!nombre || !apellido || !dni || !nombre_usuario || !password) {
    res.status(400);
    throw new Error(
      "Faltan datos requeridos (nombre, apellido, dni, nombre_usuario, password)"
    );
  }

  try {
    // Validar que nombre_usuario no exista
    const existeUsuario = await execute(
      "SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?",
      [nombre_usuario]
    );
    if (existeUsuario.length > 0) {
      res.status(400);
      throw new Error("El nombre de usuario ya existe");
    }

    // Validar que DNI no exista
    const existeDni = await execute(
      "SELECT id_persona FROM personas WHERE dni = ?",
      [dni]
    );
    if (existeDni.length > 0) {
      res.status(400);
      throw new Error("El DNI ya existe");
    }

    // Usar fecha de nacimiento proporcionada o una por defecto
    const fechaNacimiento = fecha_nacimiento || "1980-01-01";

    // Crear persona
    const personaResult = await execute(
      `
            INSERT INTO personas (dni, nombre, apellido, fecha_nacimiento, genero, direccion, telefono, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        dni,
        nombre,
        apellido,
        fechaNacimiento,
        genero || null,
        direccion || null,
        telefono || null,
        email || null,
      ]
    );

    const id_persona = personaResult.insertId;

    // Crear recepcionista
    await execute(
      `
            INSERT INTO recepcionistas (id_persona)
            VALUES (?)
        `,
      [id_persona]
    );

    // Crear usuario para login
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const id_rol_sistema = 3; // RECEPCIONISTA
    await execute(
      `
            INSERT INTO usuarios (id_persona, nombre_usuario, password, id_rol_sistema, activo)
            VALUES (?, ?, ?, ?, 1)
        `,
      [id_persona, nombre_usuario, passwordEncriptada, id_rol_sistema]
    );

    res.json({
      success: true,
      message: "Recepcionista y usuario creados exitosamente",
    });
  } catch (error) {
    console.error("Error en createRecepcionista:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error al crear recepcionista",
      });
  }
});

const updateRecepcionista = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, email } = req.body;

  try {
    // Obtener id_persona del recepcionista
    const recepcionista = await execute(
      "SELECT id_persona FROM recepcionistas WHERE id_recepcionista = ?",
      [id]
    );
    if (!recepcionista.length) {
      res.status(404);
      throw new Error("Recepcionista no encontrado");
    }

    const id_persona = recepcionista[0].id_persona;

    // Actualizar persona
    await execute(
      `
            UPDATE personas
            SET nombre = COALESCE(?, nombre),
                apellido = COALESCE(?, apellido),
                telefono = COALESCE(?, telefono),
                email = COALESCE(?, email)
            WHERE id_persona = ?
        `,
      [nombre, apellido, telefono, email, id_persona]
    );

    res.json({ success: true, message: "Recepcionista actualizado" });
  } catch (error) {
    console.error("Error en updateRecepcionista:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const deleteRecepcionista = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const recepcionista = await execute(
      "SELECT id_persona FROM recepcionistas WHERE id_recepcionista = ?",
      [id]
    );
    if (!recepcionista.length) {
      res.status(404);
      throw new Error("Recepcionista no encontrado");
    }

    const id_persona = recepcionista[0].id_persona;

    // Eliminar recepcionista
    await execute("DELETE FROM recepcionistas WHERE id_recepcionista = ?", [
      id,
    ]);

    // Eliminar persona
    await execute("DELETE FROM personas WHERE id_persona = ?", [id_persona]);

    res.json({ success: true, message: "Recepcionista eliminado" });
  } catch (error) {
    console.error("Error en deleteRecepcionista:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== INFRAESTRUCTURA - HABITACIONES =====

const getHabitaciones = asyncHandler(async (req, res) => {
  const habitaciones = await execute(`
        SELECT id_habitacion, numero_habitacion, tipo_habitacion
        FROM habitaciones
        ORDER BY numero_habitacion
    `);

  res.json({
    success: true,
    data: habitaciones,
  });
});

const createHabitacion = asyncHandler(async (req, res) => {
  const { numero_habitacion, tipo_habitacion } = req.body;

  if (!numero_habitacion || !tipo_habitacion) {
    res.status(400);
    throw new Error("Número de habitación y tipo son requeridos");
  }

  // Verificar que no exista ya
  const existente = await execute(
    "SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = ?",
    [numero_habitacion]
  );
  if (existente.length > 0) {
    res.status(400);
    throw new Error("Este número de habitación ya existe");
  }

  const resultado = await execute(
    `
        INSERT INTO habitaciones (numero_habitacion, tipo_habitacion)
        VALUES (?, ?)
    `,
    [numero_habitacion, tipo_habitacion]
  );

  res.status(201).json({
    success: true,
    message: "Habitación creada",
    id_habitacion: resultado.insertId,
  });
});

const updateHabitacion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { numero_habitacion, tipo_habitacion } = req.body;

  if (!numero_habitacion || !tipo_habitacion) {
    res.status(400);
    throw new Error("Número de habitación y tipo son requeridos");
  }

  // Verificar que existe
  const existente = await execute(
    "SELECT id_habitacion FROM habitaciones WHERE id_habitacion = ?",
    [id]
  );
  if (existente.length === 0) {
    res.status(404);
    throw new Error("Habitación no encontrada");
  }

  // Verificar que no exista otro con ese número
  const duplicado = await execute(
    "SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = ? AND id_habitacion != ?",
    [numero_habitacion, id]
  );
  if (duplicado.length > 0) {
    res.status(400);
    throw new Error("Este número de habitación ya existe");
  }

  await execute(
    `
        UPDATE habitaciones
        SET numero_habitacion = ?, tipo_habitacion = ?
        WHERE id_habitacion = ?
    `,
    [numero_habitacion, tipo_habitacion, id]
  );

  res.json({
    success: true,
    message: "Habitación actualizada",
  });
});

const deleteHabitacion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existente = await execute(
    "SELECT id_habitacion FROM habitaciones WHERE id_habitacion = ?",
    [id]
  );
  if (existente.length === 0) {
    res.status(404);
    throw new Error("Habitación no encontrada");
  }

  // Eliminar camas asociadas primero
  await execute("DELETE FROM camas WHERE id_habitacion = ?", [id]);

  // Eliminar habitación
  await execute("DELETE FROM habitaciones WHERE id_habitacion = ?", [id]);

  res.json({
    success: true,
    message: "Habitación eliminada",
  });
});

// ===== INFRAESTRUCTURA - CAMAS =====

const getCamas = asyncHandler(async (req, res) => {
  const camas = await execute(`
        SELECT id_cama, id_habitacion, numero_cama, estado
        FROM camas
        ORDER BY id_habitacion, numero_cama
    `);

  res.json({
    success: true,
    data: camas,
  });
});

const createCama = asyncHandler(async (req, res) => {
  const { id_habitacion, numero_cama, estado } = req.body;

  if (!id_habitacion || !numero_cama) {
    res.status(400);
    throw new Error("Habitación y número de cama son requeridos");
  }

  // Verificar que la habitación existe
  const habitacion = await execute(
    "SELECT id_habitacion FROM habitaciones WHERE id_habitacion = ?",
    [id_habitacion]
  );
  if (habitacion.length === 0) {
    res.status(404);
    throw new Error("Habitación no encontrada");
  }

  // Verificar que no exista cama con ese número en esa habitación
  const existente = await execute(
    "SELECT id_cama FROM camas WHERE id_habitacion = ? AND numero_cama = ?",
    [id_habitacion, numero_cama]
  );
  if (existente.length > 0) {
    res.status(400);
    throw new Error("Este número de cama ya existe en esa habitación");
  }

  const resultado = await execute(
    `
        INSERT INTO camas (id_habitacion, numero_cama, estado)
        VALUES (?, ?, ?)
    `,
    [id_habitacion, numero_cama, estado || "Disponible"]
  );

  res.status(201).json({
    success: true,
    message: "Cama creada",
    id_cama: resultado.insertId,
  });
});

const updateCama = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { id_habitacion, numero_cama, estado } = req.body;

  if (!id_habitacion || !numero_cama) {
    res.status(400);
    throw new Error("Habitación y número de cama son requeridos");
  }

  // Verificar que la cama existe
  const existente = await execute(
    "SELECT id_cama FROM camas WHERE id_cama = ?",
    [id]
  );
  if (existente.length === 0) {
    res.status(404);
    throw new Error("Cama no encontrada");
  }

  // Verificar que la habitación existe
  const habitacion = await execute(
    "SELECT id_habitacion FROM habitaciones WHERE id_habitacion = ?",
    [id_habitacion]
  );
  if (habitacion.length === 0) {
    res.status(404);
    throw new Error("Habitación no encontrada");
  }

  // Verificar que no exista otro con ese número en esa habitación
  const duplicado = await execute(
    "SELECT id_cama FROM camas WHERE id_habitacion = ? AND numero_cama = ? AND id_cama != ?",
    [id_habitacion, numero_cama, id]
  );
  if (duplicado.length > 0) {
    res.status(400);
    throw new Error("Este número de cama ya existe en esa habitación");
  }

  await execute(
    `
        UPDATE camas
        SET id_habitacion = ?, numero_cama = ?, estado = ?
        WHERE id_cama = ?
    `,
    [id_habitacion, numero_cama, estado || "Disponible", id]
  );

  res.json({
    success: true,
    message: "Cama actualizada",
  });
});

const deleteCama = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existente = await execute(
    "SELECT id_cama FROM camas WHERE id_cama = ?",
    [id]
  );
  if (existente.length === 0) {
    res.status(404);
    throw new Error("Cama no encontrada");
  }

  await execute("DELETE FROM camas WHERE id_cama = ?", [id]);

  res.json({
    success: true,
    message: "Cama eliminada",
  });
});

// ===== INFRAESTRUCTURA - QUIRÓFANOS =====

const getQuirofanos = asyncHandler(async (req, res) => {
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

const createQuirofano = asyncHandler(async (req, res) => {
  const { nombre, estado } = req.body;

  if (!nombre) {
    res.status(400);
    throw new Error("Nombre del quirófano es requerido");
  }

  // Verificar que no exista ya
  const existente = await execute(
    "SELECT id_quirofano FROM quirofanos WHERE nombre = ?",
    [nombre]
  );
  if (existente.length > 0) {
    res.status(400);
    throw new Error("Este nombre de quirófano ya existe");
  }

  const resultado = await execute(
    `
        INSERT INTO quirofanos (nombre, estado)
        VALUES (?, ?)
    `,
    [nombre, estado || "Disponible"]
  );

  res.status(201).json({
    success: true,
    message: "Quirófano creado",
    id_quirofano: resultado.insertId,
  });
});

const updateQuirofano = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, estado } = req.body;

  if (!nombre) {
    res.status(400);
    throw new Error("Nombre del quirófano es requerido");
  }

  // Verificar que existe
  const existente = await execute(
    "SELECT id_quirofano FROM quirofanos WHERE id_quirofano = ?",
    [id]
  );
  if (existente.length === 0) {
    res.status(404);
    throw new Error("Quirófano no encontrado");
  }

  // Verificar que no exista otro con ese nombre
  const duplicado = await execute(
    "SELECT id_quirofano FROM quirofanos WHERE nombre = ? AND id_quirofano != ?",
    [nombre, id]
  );
  if (duplicado.length > 0) {
    res.status(400);
    throw new Error("Este nombre de quirófano ya existe");
  }

  await execute(
    `
        UPDATE quirofanos
        SET nombre = ?, estado = ?
        WHERE id_quirofano = ?
    `,
    [nombre, estado || "Disponible", id]
  );

  res.json({
    success: true,
    message: "Quirófano actualizado",
  });
});

const deleteQuirofano = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existente = await execute(
    "SELECT id_quirofano FROM quirofanos WHERE id_quirofano = ?",
    [id]
  );
  if (existente.length === 0) {
    res.status(404);
    throw new Error("Quirófano no encontrado");
  }

  await execute("DELETE FROM quirofanos WHERE id_quirofano = ?", [id]);

  res.json({
    success: true,
    message: "Quirófano eliminado",
  });
});

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario,
  getDashboardAdmin,
  // Productos
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  // Compras
  getCompras,
  createCompra,
  // Prestaciones
  getPrestaciones,
  createPrestacion,
  updatePrestacion,
  deletePrestacion,
  // Facturas
  getFacturas,
  // Reportes
  getReportes,
  // Auditorías
  getAuditorias,
  // Especialidades
  getEspecialidades,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
  // Médicos
  getMedicos,
  createMedico,
  updateMedico,
  deleteMedico,
  // Pacientes
  getPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
  // Enfermeros
  getEnfermeros,
  createEnfermero,
  updateEnfermero,
  deleteEnfermero,
  // Recepcionistas
  getRecepcionistas,
  createRecepcionista,
  updateRecepcionista,
  deleteRecepcionista,
  // Infraestructura - Habitaciones
  getHabitaciones,
  createHabitacion,
  updateHabitacion,
  deleteHabitacion,
  // Infraestructura - Camas
  getCamas,
  createCama,
  updateCama,
  deleteCama,
  // Infraestructura - Quirófanos
  getQuirofanos,
  createQuirofano,
  updateQuirofano,
  deleteQuirofano,
};
