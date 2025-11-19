const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Importamos las funciones del controlador de administración
const { 
    getDashboardAdmin,
    obtenerUsuarios, 
    crearUsuario, 
    actualizarUsuario, 
    cambiarEstadoUsuario, 
    eliminarUsuario,
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
} = require('../controllers/adminController');

// Dashboard principal del admin
router.get('/dashboard', protect, getDashboardAdmin);

// ===== USUARIOS =====
router.get('/users', protect, obtenerUsuarios);
router.post('/users', protect, crearUsuario);
router.put('/users/:id', protect, actualizarUsuario);
router.put('/users/toggle/:id', protect, cambiarEstadoUsuario);
router.delete('/users/:id', protect, eliminarUsuario);

// ===== PRODUCTOS =====
router.get('/productos', protect, getProductos);
router.post('/productos', protect, createProducto);
router.put('/productos/:id', protect, updateProducto);
router.delete('/productos/:id', protect, deleteProducto);

// ===== COMPRAS =====
router.get('/compras', protect, getCompras);
router.post('/compras', protect, createCompra);

// ===== PRESTACIONES =====
router.get('/prestaciones', protect, getPrestaciones);
router.post('/prestaciones', protect, createPrestacion);
router.put('/prestaciones/:id', protect, updatePrestacion);
router.delete('/prestaciones/:id', protect, deletePrestacion);

// ===== FACTURAS =====
router.get('/facturas', protect, getFacturas);

// ===== REPORTES =====
router.get('/reportes', protect, getReportes);

// ===== AUDITORÍAS =====
router.get('/auditorias', protect, getAuditorias);

// ===== ESPECIALIDADES =====
router.get('/especialidades', protect, getEspecialidades);
router.post('/especialidades', protect, createEspecialidad);
router.put('/especialidades/:id', protect, updateEspecialidad);
router.delete('/especialidades/:id', protect, deleteEspecialidad);

// ===== MÉDICOS =====
router.get('/medicos', protect, getMedicos);
router.post('/medicos', protect, createMedico);
router.put('/medicos/:id', protect, updateMedico);
router.delete('/medicos/:id', protect, deleteMedico);

// ===== PACIENTES =====
router.get('/pacientes', protect, getPacientes);
router.post('/pacientes', protect, createPaciente);
router.put('/pacientes/:id', protect, updatePaciente);
router.delete('/pacientes/:id', protect, deletePaciente);

// ===== ENFERMEROS =====
router.get('/enfermeros', protect, getEnfermeros);
router.post('/enfermeros', protect, createEnfermero);
router.put('/enfermeros/:id', protect, updateEnfermero);
router.delete('/enfermeros/:id', protect, deleteEnfermero);

// ===== RECEPCIONISTAS =====
router.get('/recepcionistas', protect, getRecepcionistas);
router.post('/recepcionistas', protect, createRecepcionista);
router.put('/recepcionistas/:id', protect, updateRecepcionista);
router.delete('/recepcionistas/:id', protect, deleteRecepcionista);

// ===== INFRAESTRUCTURA - HABITACIONES =====
router.get('/habitaciones', protect, getHabitaciones);
router.post('/habitaciones', protect, createHabitacion);
router.put('/habitaciones/:id', protect, updateHabitacion);
router.delete('/habitaciones/:id', protect, deleteHabitacion);

// ===== INFRAESTRUCTURA - CAMAS =====
router.get('/camas', protect, getCamas);
router.post('/camas', protect, createCama);
router.put('/camas/:id', protect, updateCama);
router.delete('/camas/:id', protect, deleteCama);

// ===== INFRAESTRUCTURA - QUIRÓFANOS =====
router.get('/quirofanos', protect, getQuirofanos);
router.post('/quirofanos', protect, createQuirofano);
router.put('/quirofanos/:id', protect, updateQuirofano);
router.delete('/quirofanos/:id', protect, deleteQuirofano);

module.exports = router;
