-- Script para insertar datos de ejemplo en Stock Lotes
-- Asegúrate de que existen productos en la tabla productos primero

-- Insertar datos de ejemplo en stock_lotes
INSERT INTO stock_lotes (id_producto, numero_lote, cantidad_actual, fecha_vencimiento) VALUES
(1, 'LOT-2024-001', 150, '2025-06-30'),
(1, 'LOT-2024-002', 200, '2025-12-31'),
(2, 'LOT-2024-003', 100, '2025-03-15'),
(2, 'LOT-2024-004', 75, '2025-09-20'),
(3, 'LOT-2024-005', 300, '2025-11-10'),
(3, 'LOT-2024-006', 250, '2025-08-25'),
(4, 'LOT-2024-007', 120, '2025-05-05'),
(4, 'LOT-2024-008', 180, '2025-10-12'),
(5, 'LOT-2024-009', 90, '2025-04-30'),
(5, 'LOT-2024-010', 110, '2025-07-18'),
(6, 'LOT-2024-011', 200, '2025-02-28'),
(6, 'LOT-2024-012', 160, '2025-09-15'),
(7, 'LOT-2024-013', 250, '2025-06-10'),
(7, 'LOT-2024-014', 140, '2025-11-30'),
(8, 'LOT-2024-015', 180, '2025-08-20'),
(8, 'LOT-2024-016', 220, '2025-12-10');

-- Verificar que los datos se insertaron correctamente
SELECT sl.id_lote, p.nombre, sl.numero_lote, sl.cantidad_actual, sl.fecha_vencimiento, sl.fecha_ingreso
FROM stock_lotes sl
JOIN productos p ON sl.id_producto = p.id_producto
ORDER BY sl.fecha_vencimiento ASC;
