-- Agregar columnas a tabla estudiosmedicos para mayor funcionalidad

ALTER TABLE `estudiosmedicos` 
ADD COLUMN `descripcion` TEXT DEFAULT NULL AFTER `tipo_estudio`,
ADD COLUMN `urgencia` ENUM('Normal', 'Urgente') DEFAULT 'Normal' AFTER `descripcion`;

-- Ver estructura actualizada
DESCRIBE `estudiosmedicos`;
