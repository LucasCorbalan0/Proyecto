const asyncHandler = require("express-async-handler");
const db = require("../config/database");

// Obtener todos los lotes
const getLotes = asyncHandler(async (req, res) => {
  const [rows] = await db.promise().query(
    `SELECT sl.*, p.nombre as nombre_producto 
     FROM stock_lotes sl 
     JOIN productos p ON sl.id_producto = p.id_producto 
     ORDER BY sl.fecha_vencimiento ASC, sl.fecha_ingreso DESC`
  );
  res.status(200).json({ data: rows });
});

// Obtener lotes por producto
const getLotesByProducto = asyncHandler(async (req, res) => {
  const { id_producto } = req.params;
  const [rows] = await db.promise().query(
    `SELECT * FROM stock_lotes 
     WHERE id_producto = ? 
     ORDER BY fecha_vencimiento ASC`,
    [id_producto]
  );
  res.status(200).json({ data: rows });
});

// Crear nuevo lote
const createLote = asyncHandler(async (req, res) => {
  const { id_producto, numero_lote, cantidad_actual, fecha_vencimiento } =
    req.body;

  // Validaciones
  if (!id_producto || !numero_lote || !cantidad_actual) {
    return res.status(400).json({
      message: "El producto, número de lote y cantidad son requeridos",
    });
  }

  if (cantidad_actual <= 0) {
    return res.status(400).json({
      message: "La cantidad debe ser mayor a 0",
    });
  }

  const [result] = await db.promise().query(
    `INSERT INTO stock_lotes (id_producto, numero_lote, cantidad_actual, fecha_vencimiento) 
     VALUES (?, ?, ?, ?)`,
    [id_producto, numero_lote, cantidad_actual, fecha_vencimiento || null]
  );

  res.status(201).json({
    message: "Lote creado correctamente",
    id_lote: result.insertId,
  });
});

// Actualizar lote
const updateLote = asyncHandler(async (req, res) => {
  const { id_lote } = req.params;
  const { cantidad_actual, fecha_vencimiento } = req.body;

  if (cantidad_actual !== undefined && cantidad_actual <= 0) {
    return res.status(400).json({
      message: "La cantidad debe ser mayor a 0",
    });
  }

  const updates = [];
  const values = [];

  if (cantidad_actual !== undefined) {
    updates.push("cantidad_actual = ?");
    values.push(cantidad_actual);
  }

  if (fecha_vencimiento !== undefined) {
    updates.push("fecha_vencimiento = ?");
    values.push(fecha_vencimiento || null);
  }

  if (updates.length === 0) {
    return res.status(400).json({
      message: "No hay campos para actualizar",
    });
  }

  values.push(id_lote);

  const [result] = await db
    .promise()
    .query(
      `UPDATE stock_lotes SET ${updates.join(", ")} WHERE id_lote = ?`,
      values
    );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Lote no encontrado" });
  }

  res.status(200).json({ message: "Lote actualizado correctamente" });
});

// Eliminar lote
const deleteLote = asyncHandler(async (req, res) => {
  const { id_lote } = req.params;

  const [result] = await db
    .promise()
    .query("DELETE FROM stock_lotes WHERE id_lote = ?", [id_lote]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Lote no encontrado" });
  }

  res.status(200).json({ message: "Lote eliminado correctamente" });
});

// Reducir cantidad de lote (para movimientos)
const reducirLote = asyncHandler(async (req, res) => {
  const { id_lote } = req.params;
  const { cantidad } = req.body;

  if (!cantidad || cantidad <= 0) {
    return res.status(400).json({
      message: "La cantidad debe ser mayor a 0",
    });
  }

  // Verificar cantidad disponible
  const [lote] = await db
    .promise()
    .query("SELECT cantidad_actual FROM stock_lotes WHERE id_lote = ?", [
      id_lote,
    ]);

  if (lote.length === 0) {
    return res.status(404).json({ message: "Lote no encontrado" });
  }

  if (lote[0].cantidad_actual < cantidad) {
    return res.status(400).json({
      message: `Stock insuficiente. Disponible: ${lote[0].cantidad_actual}`,
    });
  }

  const nuevaCantidad = lote[0].cantidad_actual - cantidad;

  await db
    .promise()
    .query("UPDATE stock_lotes SET cantidad_actual = ? WHERE id_lote = ?", [
      nuevaCantidad,
      id_lote,
    ]);

  res.status(200).json({
    message: "Stock reducido correctamente",
    nueva_cantidad: nuevaCantidad,
  });
});

// Obtener stock total por producto
const getStockTotalProducto = asyncHandler(async (req, res) => {
  const { id_producto } = req.params;

  const [rows] = await db.promise().query(
    `SELECT SUM(cantidad_actual) as stock_total 
     FROM stock_lotes 
     WHERE id_producto = ?`,
    [id_producto]
  );

  const stockTotal = rows[0].stock_total || 0;

  res.status(200).json({
    id_producto,
    stock_total: stockTotal,
  });
});

module.exports = {
  getLotes,
  getLotesByProducto,
  createLote,
  updateLote,
  deleteLote,
  reducirLote,
  getStockTotalProducto,
};
