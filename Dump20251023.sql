-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: hospitaldb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditorias`
--

DROP TABLE IF EXISTS `auditorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditorias` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `accion` varchar(255) NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `auditorias_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditorias`
--

LOCK TABLES `auditorias` WRITE;
/*!40000 ALTER TABLE `auditorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camas`
--

DROP TABLE IF EXISTS `camas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camas` (
  `id_cama` int NOT NULL AUTO_INCREMENT,
  `id_habitacion` int NOT NULL,
  `numero_cama` varchar(50) NOT NULL,
  `estado` enum('Disponible','Ocupada','En Mantenimiento','Limpieza') DEFAULT 'Disponible',
  PRIMARY KEY (`id_cama`),
  UNIQUE KEY `id_habitacion` (`id_habitacion`,`numero_cama`),
  CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camas`
--

LOCK TABLES `camas` WRITE;
/*!40000 ALTER TABLE `camas` DISABLE KEYS */;
/*!40000 ALTER TABLE `camas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cirugias`
--

DROP TABLE IF EXISTS `cirugias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cirugias` (
  `id_cirugia` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_medico` int NOT NULL,
  `id_quirofano` int DEFAULT NULL,
  `fecha_programada` datetime NOT NULL,
  `tipo_cirugia` varchar(100) NOT NULL,
  `estado` enum('Programada','Realizada','Cancelada') DEFAULT 'Programada',
  PRIMARY KEY (`id_cirugia`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_medico` (`id_medico`),
  KEY `id_quirofano` (`id_quirofano`),
  CONSTRAINT `cirugias_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cirugias_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `cirugias_ibfk_3` FOREIGN KEY (`id_quirofano`) REFERENCES `quirofanos` (`id_quirofano`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cirugias`
--

LOCK TABLES `cirugias` WRITE;
/*!40000 ALTER TABLE `cirugias` DISABLE KEYS */;
/*!40000 ALTER TABLE `cirugias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `id_proveedor` int NOT NULL,
  `fecha_pedido` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Pendiente','Recibida','Cancelada') DEFAULT 'Pendiente',
  PRIMARY KEY (`id_compra`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras_detalle`
--

DROP TABLE IF EXISTS `compras_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras_detalle` (
  `id_compra_detalle` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_compra_detalle`),
  KEY `id_compra` (`id_compra`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `compras_detalle_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compras_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras_detalle`
--

LOCK TABLES `compras_detalle` WRITE;
/*!40000 ALTER TABLE `compras_detalle` DISABLE KEYS */;
/*!40000 ALTER TABLE `compras_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultas`
--

DROP TABLE IF EXISTS `consultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas` (
  `id_consulta` int NOT NULL AUTO_INCREMENT,
  `id_historia` int NOT NULL,
  `id_medico` int NOT NULL,
  `fecha_consulta` datetime DEFAULT CURRENT_TIMESTAMP,
  `motivo_consulta` text NOT NULL,
  `diagnostico` text,
  `tratamiento` text,
  PRIMARY KEY (`id_consulta`),
  KEY `id_historia` (`id_historia`),
  KEY `id_medico` (`id_medico`),
  CONSTRAINT `consultas_ibfk_1` FOREIGN KEY (`id_historia`) REFERENCES `historiasclinicas` (`id_historia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `consultas_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultas`
--

LOCK TABLES `consultas` WRITE;
/*!40000 ALTER TABLE `consultas` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disponibilidad_medicos`
--

DROP TABLE IF EXISTS `disponibilidad_medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disponibilidad_medicos` (
  `id_disponibilidad` int NOT NULL AUTO_INCREMENT,
  `id_medico` int NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`id_disponibilidad`),
  UNIQUE KEY `id_medico` (`id_medico`,`fecha`,`hora_inicio`),
  CONSTRAINT `disponibilidad_medicos_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disponibilidad_medicos`
--

LOCK TABLES `disponibilidad_medicos` WRITE;
/*!40000 ALTER TABLE `disponibilidad_medicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `disponibilidad_medicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enfermeros`
--

DROP TABLE IF EXISTS `enfermeros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enfermeros` (
  `id_enfermero` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `matricula` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_enfermero`),
  UNIQUE KEY `id_persona` (`id_persona`),
  UNIQUE KEY `matricula` (`matricula`),
  CONSTRAINT `enfermeros_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enfermeros`
--

LOCK TABLES `enfermeros` WRITE;
/*!40000 ALTER TABLE `enfermeros` DISABLE KEYS */;
/*!40000 ALTER TABLE `enfermeros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `id_especialidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `es_quirurgica` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_especialidad`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidades`
--

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiosmedicos`
--

DROP TABLE IF EXISTS `estudiosmedicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiosmedicos` (
  `id_estudio` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_medico` int NOT NULL,
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_estudio` varchar(100) NOT NULL,
  `estado` enum('Pendiente','Realizado','Resultado Disponible','Cancelado') DEFAULT 'Pendiente',
  `fecha_resultado` datetime DEFAULT NULL,
  `ruta_resultado_pdf` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_estudio`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_medico` (`id_medico`),
  CONSTRAINT `estudiosmedicos_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `estudiosmedicos_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiosmedicos`
--

LOCK TABLES `estudiosmedicos` WRITE;
/*!40000 ALTER TABLE `estudiosmedicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `estudiosmedicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evoluciones`
--

DROP TABLE IF EXISTS `evoluciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evoluciones` (
  `id_evolucion` int NOT NULL AUTO_INCREMENT,
  `id_historia` int NOT NULL,
  `id_personal` int DEFAULT NULL,
  `tipo_personal` enum('Medico','Enfermero') DEFAULT NULL,
  `fecha_evolucion` datetime DEFAULT CURRENT_TIMESTAMP,
  `nota` text,
  `temperatura` decimal(4,2) DEFAULT NULL,
  `presion_arterial_sistolica` int DEFAULT NULL,
  `presion_arterial_diastolica` int DEFAULT NULL,
  `frecuencia_cardiaca` int DEFAULT NULL,
  `saturacion_oxigeno` int DEFAULT NULL,
  PRIMARY KEY (`id_evolucion`),
  KEY `id_historia` (`id_historia`),
  CONSTRAINT `evoluciones_ibfk_1` FOREIGN KEY (`id_historia`) REFERENCES `historiasclinicas` (`id_historia`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evoluciones`
--

LOCK TABLES `evoluciones` WRITE;
/*!40000 ALTER TABLE `evoluciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `evoluciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturacion`
--

DROP TABLE IF EXISTS `facturacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturacion` (
  `id_factura` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `fecha_emision` datetime DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL,
  `estado_pago` enum('Pendiente','Pagada','Anulada') DEFAULT 'Pendiente',
  PRIMARY KEY (`id_factura`),
  KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `facturacion_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturacion`
--

LOCK TABLES `facturacion` WRITE;
/*!40000 ALTER TABLE `facturacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `facturacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturacion_detalle`
--

DROP TABLE IF EXISTS `facturacion_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturacion_detalle` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_factura` int NOT NULL,
  `id_prestacion` int DEFAULT NULL,
  `descripcion_item` varchar(255) NOT NULL,
  `cantidad` int DEFAULT '1',
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal_item` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_factura` (`id_factura`),
  KEY `id_prestacion` (`id_prestacion`),
  CONSTRAINT `facturacion_detalle_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `facturacion` (`id_factura`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `facturacion_detalle_ibfk_2` FOREIGN KEY (`id_prestacion`) REFERENCES `prestaciones` (`id_prestacion`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturacion_detalle`
--

LOCK TABLES `facturacion_detalle` WRITE;
/*!40000 ALTER TABLE `facturacion_detalle` DISABLE KEYS */;
/*!40000 ALTER TABLE `facturacion_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitaciones`
--

DROP TABLE IF EXISTS `habitaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitaciones` (
  `id_habitacion` int NOT NULL AUTO_INCREMENT,
  `numero_habitacion` varchar(50) NOT NULL,
  `tipo_habitacion` enum('Simple','Doble','UCI') NOT NULL,
  PRIMARY KEY (`id_habitacion`),
  UNIQUE KEY `numero_habitacion` (`numero_habitacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitaciones`
--

LOCK TABLES `habitaciones` WRITE;
/*!40000 ALTER TABLE `habitaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `habitaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historiasclinicas`
--

DROP TABLE IF EXISTS `historiasclinicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historiasclinicas` (
  `id_historia` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `tipo_sangre` varchar(3) DEFAULT NULL,
  `factor_rh` enum('Positivo','Negativo') DEFAULT NULL,
  `alergias_conocidas` text,
  `comorbilidades_cronicas` text,
  `medicacion_habitual` text,
  `antecedentes_quirurgicos` text,
  `contacto_emergencia_nombre` varchar(100) DEFAULT NULL,
  `contacto_emergencia_telefono` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_historia`),
  UNIQUE KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `historiasclinicas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historiasclinicas`
--

LOCK TABLES `historiasclinicas` WRITE;
/*!40000 ALTER TABLE `historiasclinicas` DISABLE KEYS */;
/*!40000 ALTER TABLE `historiasclinicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internaciones`
--

DROP TABLE IF EXISTS `internaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internaciones` (
  `id_internacion` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_medico` int NOT NULL,
  `id_cama` int DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_egreso` datetime DEFAULT NULL,
  `estado` enum('Activa','Finalizada') DEFAULT 'Activa',
  PRIMARY KEY (`id_internacion`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_medico` (`id_medico`),
  KEY `id_cama` (`id_cama`),
  CONSTRAINT `internaciones_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `internaciones_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `internaciones_ibfk_3` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id_cama`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internaciones`
--

LOCK TABLES `internaciones` WRITE;
/*!40000 ALTER TABLE `internaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `internaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internaciones_enfermeros`
--

DROP TABLE IF EXISTS `internaciones_enfermeros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internaciones_enfermeros` (
  `id_internacion_enfermero` int NOT NULL AUTO_INCREMENT,
  `id_internacion` int NOT NULL,
  `id_enfermero` int NOT NULL,
  PRIMARY KEY (`id_internacion_enfermero`),
  KEY `id_internacion` (`id_internacion`),
  KEY `id_enfermero` (`id_enfermero`),
  CONSTRAINT `internaciones_enfermeros_ibfk_1` FOREIGN KEY (`id_internacion`) REFERENCES `internaciones` (`id_internacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `internaciones_enfermeros_ibfk_2` FOREIGN KEY (`id_enfermero`) REFERENCES `enfermeros` (`id_enfermero`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internaciones_enfermeros`
--

LOCK TABLES `internaciones_enfermeros` WRITE;
/*!40000 ALTER TABLE `internaciones_enfermeros` DISABLE KEYS */;
/*!40000 ALTER TABLE `internaciones_enfermeros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicos`
--

DROP TABLE IF EXISTS `medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicos` (
  `id_medico` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `matricula` varchar(30) NOT NULL,
  `id_especialidad` int NOT NULL,
  PRIMARY KEY (`id_medico`),
  UNIQUE KEY `id_persona` (`id_persona`),
  UNIQUE KEY `matricula` (`matricula`),
  KEY `id_especialidad` (`id_especialidad`),
  CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicos_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos`
--

LOCK TABLES `medicos` WRITE;
/*!40000 ALTER TABLE `medicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id_paciente` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  PRIMARY KEY (`id_paciente`),
  UNIQUE KEY `id_persona` (`id_persona`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_factura` int NOT NULL,
  `fecha_pago` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto_pago` decimal(10,2) NOT NULL,
  `metodo_pago` enum('Efectivo','Tarjeta Credito','Tarjeta Debito','Transferencia') NOT NULL,
  `id_recepcionista` int DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_factura` (`id_factura`),
  KEY `id_recepcionista` (`id_recepcionista`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `facturacion` (`id_factura`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`id_recepcionista`) REFERENCES `recepcionistas` (`id_recepcionista`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `id_rol_sistema` int NOT NULL,
  `modulo` varchar(100) NOT NULL,
  `accion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `id_rol_sistema` (`id_rol_sistema`,`modulo`,`accion`),
  CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`id_rol_sistema`) REFERENCES `rolessistema` (`id_rol_sistema`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personas`
--

DROP TABLE IF EXISTS `personas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personas` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personas`
--

LOCK TABLES `personas` WRITE;
/*!40000 ALTER TABLE `personas` DISABLE KEYS */;
/*!40000 ALTER TABLE `personas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestaciones`
--

DROP TABLE IF EXISTS `prestaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestaciones` (
  `id_prestacion` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_prestacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestaciones`
--

LOCK TABLES `prestaciones` WRITE;
/*!40000 ALTER TABLE `prestaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `prestaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `tipo_producto` enum('Medicamento','Insumo','Material Quirurgico') NOT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quirofanos`
--

DROP TABLE IF EXISTS `quirofanos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quirofanos` (
  `id_quirofano` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` enum('Disponible','Ocupado','En Mantenimiento','Limpieza') DEFAULT 'Disponible',
  PRIMARY KEY (`id_quirofano`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quirofanos`
--

LOCK TABLES `quirofanos` WRITE;
/*!40000 ALTER TABLE `quirofanos` DISABLE KEYS */;
/*!40000 ALTER TABLE `quirofanos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recepcionistas`
--

DROP TABLE IF EXISTS `recepcionistas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recepcionistas` (
  `id_recepcionista` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  PRIMARY KEY (`id_recepcionista`),
  UNIQUE KEY `id_persona` (`id_persona`),
  CONSTRAINT `recepcionistas_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recepcionistas`
--

LOCK TABLES `recepcionistas` WRITE;
/*!40000 ALTER TABLE `recepcionistas` DISABLE KEYS */;
/*!40000 ALTER TABLE `recepcionistas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas`
--

DROP TABLE IF EXISTS `recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas` (
  `id_receta` int NOT NULL AUTO_INCREMENT,
  `id_consulta` int DEFAULT NULL,
  `id_medico` int NOT NULL,
  `fecha_emision` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_receta`),
  KEY `id_consulta` (`id_consulta`),
  KEY `id_medico` (`id_medico`),
  CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`id_consulta`) REFERENCES `consultas` (`id_consulta`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `recetas_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas`
--

LOCK TABLES `recetas` WRITE;
/*!40000 ALTER TABLE `recetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `recetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas_detalle`
--

DROP TABLE IF EXISTS `recetas_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas_detalle` (
  `id_receta_detalle` int NOT NULL AUTO_INCREMENT,
  `id_receta` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `dosis` varchar(100) DEFAULT NULL,
  `frecuencia` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_receta_detalle`),
  KEY `id_receta` (`id_receta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `recetas_detalle_ibfk_1` FOREIGN KEY (`id_receta`) REFERENCES `recetas` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recetas_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas_detalle`
--

LOCK TABLES `recetas_detalle` WRITE;
/*!40000 ALTER TABLE `recetas_detalle` DISABLE KEYS */;
/*!40000 ALTER TABLE `recetas_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolessistema`
--

DROP TABLE IF EXISTS `rolessistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolessistema` (
  `id_rol_sistema` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol_sistema`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolessistema`
--

LOCK TABLES `rolessistema` WRITE;
/*!40000 ALTER TABLE `rolessistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `rolessistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_lotes`
--

DROP TABLE IF EXISTS `stock_lotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_lotes` (
  `id_lote` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `numero_lote` varchar(50) NOT NULL,
  `cantidad_actual` int NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_lote`),
  UNIQUE KEY `id_producto` (`id_producto`,`numero_lote`),
  CONSTRAINT `stock_lotes_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_lotes`
--

LOCK TABLES `stock_lotes` WRITE;
/*!40000 ALTER TABLE `stock_lotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_lotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_turno`
--

DROP TABLE IF EXISTS `tipos_turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_turno` (
  `id_tipo_turno` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  `duracion_estimada_minutos` int NOT NULL,
  `precio_asociado_id_prestacion` int DEFAULT NULL,
  PRIMARY KEY (`id_tipo_turno`),
  UNIQUE KEY `descripcion` (`descripcion`),
  KEY `fk_tipos_turno_prestaciones` (`precio_asociado_id_prestacion`),
  CONSTRAINT `fk_tipos_turno_prestaciones` FOREIGN KEY (`precio_asociado_id_prestacion`) REFERENCES `prestaciones` (`id_prestacion`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_turno`
--

LOCK TABLES `tipos_turno` WRITE;
/*!40000 ALTER TABLE `tipos_turno` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipos_turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `id_turno` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time DEFAULT NULL,
  `id_paciente` int NOT NULL,
  `id_medico` int NOT NULL,
  `id_tipo_turno` int DEFAULT NULL,
  `estado` enum('Reservado','En Espera','Atendido','Cancelado','No Show') DEFAULT 'Reservado',
  PRIMARY KEY (`id_turno`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_medico` (`id_medico`),
  KEY `id_tipo_turno` (`id_tipo_turno`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`id_tipo_turno`) REFERENCES `tipos_turno` (`id_tipo_turno`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_persona` int NOT NULL,
  `id_rol_sistema` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  KEY `id_persona` (`id_persona`),
  KEY `id_rol_sistema` (`id_rol_sistema`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_rol_sistema`) REFERENCES `rolessistema` (`id_rol_sistema`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-23 19:40:22
