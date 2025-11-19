const express = require("express");
const {
  getLotes,
  getLotesByProducto,
  createLote,
  updateLote,
  deleteLote,
  reducirLote,
  getStockTotalProducto,
} = require("../controllers/stockController");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Rutas para stock
router.use(protect);

// Obtener todos los lotes
router.get("/lotes", getLotes);

// Obtener lotes por producto
router.get("/lotes/producto/:id_producto", getLotesByProducto);

// Obtener stock total de un producto
router.get("/stock-total/:id_producto", getStockTotalProducto);

// Crear nuevo lote
router.post("/lotes", createLote);

// Actualizar lote
router.put("/lotes/:id_lote", updateLote);

// Eliminar lote
router.delete("/lotes/:id_lote", deleteLote);

// Reducir stock de lote (para movimientos/salidas)
router.post("/lotes/:id_lote/reducir", reducirLote);

module.exports = router;
