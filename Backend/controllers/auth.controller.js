const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { execute, JWT_SECRET } = require("../config/database");

const iniciarSesion = asyncHandler(async (req, res) => {
  const { nombre_usuario, password } = req.body;

  // Verificamos que se hayan enviado ambos campos
  if (!nombre_usuario || !password) {
    res.status(400);
    throw new Error("Por favor complete todos los campos");
  }

  // Buscamos el usuario en la base de datos
  const consulta = `
        SELECT u.id_usuario, u.nombre_usuario, u.password, u.id_rol_sistema,
               p.nombre, p.apellido, p.dni, p.email, p.telefono, p.direccion, pac.id_paciente,
               m.id_medico, e.nombre as especialidad
        FROM usuarios u
        JOIN personas p ON u.id_persona = p.id_persona
        LEFT JOIN pacientes pac ON pac.id_persona = p.id_persona
        LEFT JOIN medicos m ON m.id_persona = p.id_persona
        LEFT JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE u.nombre_usuario = ?
    `;

  const resultado = await execute(consulta, [nombre_usuario]);

  if (resultado.length === 0) {
    res.status(401);
    throw new Error("Credenciales inválidas");
  }

  const usuario = resultado[0];
  const coincide = await bcrypt.compare(password, usuario.password);

  if (!coincide) {
    res.status(401);
    throw new Error("contraseña y/o usuario incorrectos");
  }

  // Generamos el token JWT
  const token = jwt.sign(
    {
      id: usuario.id_usuario,
      rol: usuario.id_rol_sistema,
      nombre_usuario: usuario.nombre_usuario,
    },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  // Enviamos el usuario logueado con su token
  res.json({
    token,
    usuario: {
      id: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      rol: usuario.id_rol_sistema,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      dni: usuario.dni,
      id_paciente: usuario.id_paciente,
      id_medico: usuario.id_medico || null,
      especialidad: usuario.especialidad || null,
    },
  });
});

const registrarUsuario = asyncHandler(async (req, res) => {
  console.log("Datos recibidos:", req.body);

  const {
    nombre,
    apellido,
    dni,
    fecha_nacimiento,
    genero,
    email,
    telefono,
    nombre_usuario,
    password,
    id_rol_sistema,
  } = req.body;

  // Verificamos que no falte ningún dato importante
  if (
    !nombre ||
    !apellido ||
    !dni ||
    !fecha_nacimiento ||
    !email ||
    !nombre_usuario ||
    !password ||
    !genero
  ) {
    res.status(400);
    throw new Error("Por favor complete todos los campos requeridos");
  }

  // Comprobamos si ya existe ese usuario, DNI o email
  const datosExistentes = await execute(
    `
        SELECT u.nombre_usuario, p.dni, p.email
        FROM usuarios u
        LEFT JOIN personas p ON p.id_persona = u.id_persona
        WHERE u.nombre_usuario = ? 
        OR p.dni = ?
        OR p.email = ?
        `,
    [nombre_usuario, dni, email]
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

  // Encriptamos la contraseña antes de guardarla
  const salt = await bcrypt.genSalt(10);
  const passwordEncriptada = await bcrypt.hash(password, salt);

  // Insertamos los datos personales en la tabla personas
  const resultadoPersona = await execute(
    `
        INSERT INTO personas (
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            genero,
            email,
            telefono,
            direccion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
    [
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      genero,
      email,
      telefono || null,
      req.body.direccion || null,
    ]
  );

  if (!resultadoPersona.insertId) {
    res.status(400);
    throw new Error("Error al registrar los datos personales");
  }

  // Insertamos los datos del usuario (login)
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
      id_rol_sistema || 6,
    ]
  );

  // Si es paciente, también lo agregamos en la tabla de pacientes
  if (resultadoUsuario.affectedRows === 1) {
    const resultadoPaciente = await execute(
      `INSERT INTO pacientes (id_persona) VALUES (?)`,
      [resultadoPersona.insertId]
    );

    // Crear historia clínica automáticamente
    if (resultadoPaciente && resultadoPaciente.insertId) {
      try {
        await execute(
          `INSERT INTO historiasclinicas (id_paciente, fecha_creacion) VALUES (?, CURDATE())`,
          [resultadoPaciente.insertId]
        );
      } catch (histErr) {
        console.error("Error creando historia clínica:", histErr);
      }
    }

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
    });
  } else {
    res.status(400);
    throw new Error("Error al registrar el usuario");
  }
});

const obtenerPerfil = asyncHandler(async (req, res) => {
  const resultado = await execute(
    `
        SELECT id_usuario, nombre, apellido, dni, fecha_nacimiento, genero, 
               email, telefono, nombre_usuario, id_rol_sistema 
        FROM usuarios 
        WHERE id_usuario = ?
        `,
    [req.user.id]
  );

  if (resultado.length === 0) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  res.json(resultado[0]);
});

module.exports = {
  iniciarSesion,
  registrarUsuario,
  obtenerPerfil,
};
