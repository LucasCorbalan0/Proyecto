const express = require("express");
const router = express.Router();
const medicoController = require("../controllers/medicoController");
const { protect } = require("../middleware/auth.middleware");

/* =====================================================
   👨‍⚕️ RUTAS MÉDICOS - GENERALES
===================================================== */

// Obtener todos los médicos
router.get("/", protect, medicoController.obtenerMedicos);

// Crear un nuevo médico
router.post("/", protect, medicoController.crearMedico);

/* =====================================================
   📊 RUTAS DASHBOARD - ESTADÍSTICAS
===================================================== */

// Obtener estadísticas del dashboard
router.get("/:id_medico/stats", protect, medicoController.obtenerEstadisticas);

// Obtener turnos en espera
router.get(
  "/:id_medico/turnos",
  protect,
  medicoController.obtenerTurnosEnEspera
);

/* =====================================================
   ⏰ RUTAS DISPONIBILIDAD DE MÉDICOS
===================================================== */

// Obtener disponibilidad de un médico
router.get(
  "/:id_medico/disponibilidad",
  protect,
  medicoController.obtenerDisponibilidad
);

// Agregar disponibilidad
router.post(
  "/:id_medico/disponibilidad",
  protect,
  medicoController.agregarDisponibilidad
);

// Actualizar disponibilidad
router.put(
  "/:id_medico/disponibilidad/:id_disponibilidad",
  protect,
  medicoController.actualizarDisponibilidad
);

// Eliminar disponibilidad
router.delete(
  "/disponibilidad/:id_disponibilidad",
  protect,
  medicoController.eliminarDisponibilidad
);

/* =====================================================
   📝 RUTAS CONSULTAS
===================================================== */

// Obtener consultas del médico
router.get("/:id_medico/consultas", protect, medicoController.obtenerConsultas);

// Crear consulta
router.post("/:id_medico/consultas", protect, medicoController.crearConsulta);

// Actualizar consulta
router.put(
  "/:id_medico/consultas/:id_consulta",
  protect,
  medicoController.actualizarConsulta
);

// Agregar evolución a consulta
router.post(
  "/:id_medico/consultas/:id_consulta/evoluciones",
  protect,
  medicoController.agregarEvolucion
);

/* =====================================================
   💊 RUTAS RECETAS
===================================================== */

// Obtener recetas del médico
router.get("/:id_medico/recetas", protect, medicoController.obtenerRecetas);

// Obtener medicamentos disponibles
router.get(
  "/:id_medico/medicamentos",
  protect,
  medicoController.obtenerMedicamentos
);

// Crear receta
router.post("/:id_medico/recetas", protect, medicoController.crearReceta);

// Obtener detalles de receta
router.get(
  "/:id_medico/recetas/:id_receta",
  protect,
  medicoController.obtenerDetallesReceta
);

/* =====================================================
   🔬 RUTAS ESTUDIOS MÉDICOS
===================================================== */

// Obtener estudios solicitados
router.get("/:id_medico/estudios", protect, medicoController.obtenerEstudios);

// Solicitar estudio
router.post("/:id_medico/estudios", protect, medicoController.solicitarEstudio);

/* =====================================================
   🏥 RUTAS CIRUGÍAS
===================================================== */

// Obtener cirugías del médico
router.get("/:id_medico/cirugias", protect, medicoController.obtenerCirugias);

// Obtener quirófanos disponibles
router.get(
  "/:id_medico/quirofanos",
  protect,
  medicoController.obtenerQuirofanos
);

// Programar cirugía
router.post("/:id_medico/cirugias", protect, medicoController.programarCirugia);

/* =====================================================
   📋 RUTAS HISTORIAL CLÍNICO
===================================================== */

// Obtener historial clínico completo de un paciente
router.get(
  "/paciente/:id_paciente/historial-clinico",
  protect,
  medicoController.obtenerHistorialClinico
);

/* =====================================================
   👨‍⚕️ RUTAS MÉDICOS - POR ID (debe ir al final)
===================================================== */

// Obtener un médico por ID
router.get("/:id_medico", protect, medicoController.obtenerMedicoPorId);

// Actualizar un médico
router.put("/:id_medico", protect, medicoController.actualizarMedico);

// Eliminar un médico
router.delete("/:id_medico", protect, medicoController.eliminarMedico);

module.exports = router;
