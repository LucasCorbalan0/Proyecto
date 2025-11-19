-- Actualización de tabla productos para agregar campos de precio y stock
-- Ejecutar esta sentencia en la base de datos hospitaldb

ALTER TABLE productos 
ADD COLUMN precio DECIMAL(10, 2) DEFAULT NULL COMMENT 'Precio unitario del producto' AFTER tipo_producto,
ADD COLUMN cantidad_stock INT DEFAULT 0 COMMENT 'Cantidad disponible en stock' AFTER precio;

-- Opcional: Crear un índice para búsquedas por tipo y stock bajo
CREATE INDEX idx_tipo_stock ON productos(tipo_producto, cantidad_stock);

-- Actualizar el enum para agregar más tipos de productos
ALTER TABLE productos 
MODIFY COLUMN tipo_producto ENUM('Medicamento','Insumo','Material Quirurgico','Equipo Medico','Otro') 
NOT NULL DEFAULT 'Insumo';

-- Verificar la estructura actualizada
-- DESCRIBE productos;
