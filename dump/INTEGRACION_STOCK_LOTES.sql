-- =====================================================
-- Script de integración Stock Lotes con Productos
-- Hospital - Base de Datos
-- =====================================================

-- Usar la base de datos
USE hospitaldb;

-- =====================================================
-- 1. CREAR TABLA stock_lotes (si no existe)
-- =====================================================
CREATE TABLE IF NOT EXISTS `stock_lotes` (
  `id_lote` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `numero_lote` varchar(50) NOT NULL,
  `cantidad_actual` int NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_lote`),
  UNIQUE KEY `unique_producto_lote` (`id_producto`,`numero_lote`),
  CONSTRAINT `stock_lotes_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_fecha_vencimiento` (`fecha_vencimiento`),
  KEY `idx_producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 2. VERIFICAR QUE LA TABLA productos EXISTE
-- =====================================================
-- La tabla productos debe tener la estructura:
-- - id_producto (INT, PK, AI)
-- - nombre (VARCHAR)
-- - descripcion (TEXT)
-- - tipo_producto (ENUM: 'Medicamento', 'Insumo', 'Material Quirurgico')

-- =====================================================
-- 3. DATOS DE EJEMPLO PARA STOCK_LOTES
-- =====================================================

-- Insertar algunos lotes de ejemplo (descomentar si deseas)
-- INSERT INTO stock_lotes (id_producto, numero_lote, cantidad_actual, fecha_vencimiento) 
-- VALUES 
-- (1, 'LOT-2024-001', 100, '2025-12-31'),
-- (1, 'LOT-2024-002', 50, '2025-06-30'),
-- (2, 'LOT-2024-003', 200, '2025-08-31');

-- =====================================================
-- 4. VISTAS ÚTILES
-- =====================================================

-- Vista: Stock total por producto
CREATE OR REPLACE VIEW vw_stock_por_producto AS
SELECT 
    p.id_producto,
    p.nombre,
    p.tipo_producto,
    COALESCE(SUM(sl.cantidad_actual), 0) as stock_total,
    COUNT(DISTINCT sl.id_lote) as cantidad_lotes,
    MIN(sl.fecha_vencimiento) as proximo_vencimiento
FROM productos p
LEFT JOIN stock_lotes sl ON p.id_producto = sl.id_producto
GROUP BY p.id_producto, p.nombre, p.tipo_producto;

-- Vista: Lotes próximos a vencer (30 días)
CREATE OR REPLACE VIEW vw_lotes_proximo_vencimiento AS
SELECT 
    sl.id_lote,
    p.nombre as producto,
    sl.numero_lote,
    sl.cantidad_actual,
    sl.fecha_vencimiento,
    DATEDIFF(sl.fecha_vencimiento, CURDATE()) as dias_para_vencer
FROM stock_lotes sl
JOIN productos p ON sl.id_producto = p.id_producto
WHERE sl.fecha_vencimiento IS NOT NULL
AND sl.fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
AND sl.fecha_vencimiento >= CURDATE()
ORDER BY sl.fecha_vencimiento ASC;

-- Vista: Lotes vencidos
CREATE OR REPLACE VIEW vw_lotes_vencidos AS
SELECT 
    sl.id_lote,
    p.nombre as producto,
    sl.numero_lote,
    sl.cantidad_actual,
    sl.fecha_vencimiento,
    DATEDIFF(CURDATE(), sl.fecha_vencimiento) as dias_vencidos
FROM stock_lotes sl
JOIN productos p ON sl.id_producto = p.id_producto
WHERE sl.fecha_vencimiento < CURDATE()
ORDER BY sl.fecha_vencimiento DESC;

-- =====================================================
-- 5. PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento: Reducir stock de un lote
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_reducir_stock_lote(
    IN p_id_lote INT,
    IN p_cantidad INT,
    OUT p_resultado VARCHAR(100)
)
BEGIN
    DECLARE v_cantidad_actual INT;
    DECLARE v_existe INT;
    
    -- Verificar que el lote existe
    SELECT COUNT(*) INTO v_existe FROM stock_lotes WHERE id_lote = p_id_lote;
    
    IF v_existe = 0 THEN
        SET p_resultado = 'ERROR: Lote no encontrado';
    ELSE
        -- Obtener cantidad actual
        SELECT cantidad_actual INTO v_cantidad_actual FROM stock_lotes WHERE id_lote = p_id_lote;
        
        -- Verificar stock suficiente
        IF v_cantidad_actual < p_cantidad THEN
            SET p_resultado = CONCAT('ERROR: Stock insuficiente. Disponible: ', v_cantidad_actual);
        ELSE
            -- Actualizar stock
            UPDATE stock_lotes 
            SET cantidad_actual = cantidad_actual - p_cantidad 
            WHERE id_lote = p_id_lote;
            
            SET p_resultado = 'OK: Stock reducido correctamente';
        END IF;
    END IF;
END$$
DELIMITER ;

-- Procedimiento: Obtener stock total de un producto
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_obtener_stock_producto(
    IN p_id_producto INT
)
BEGIN
    SELECT 
        id_producto,
        nombre,
        tipo_producto,
        stock_total,
        cantidad_lotes,
        proximo_vencimiento
    FROM vw_stock_por_producto
    WHERE id_producto = p_id_producto;
END$$
DELIMITER ;

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================
-- Los índices ya están creados en la tabla, pero aquí están documentados
-- - id_lote (PK)
-- - id_producto (FK)
-- - unique_producto_lote (UNIQUE)
-- - idx_fecha_vencimiento (para búsquedas por vencimiento)
-- - idx_producto (para búsquedas por producto)

-- =====================================================
-- 7. VERIFICACIÓN FINAL
-- =====================================================
SELECT '✓ Script de integración completado' as estado;
SELECT CONCAT('✓ Tabla stock_lotes creada/verificada - Registros: ', COUNT(*)) as status FROM stock_lotes;
