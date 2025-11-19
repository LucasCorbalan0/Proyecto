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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personas`
--

LOCK TABLES `personas` WRITE;
/*!40000 ALTER TABLE `personas` DISABLE KEYS */;
INSERT INTO `personas` VALUES (1,'20111111','Carlos','Administrador','1980-01-15','Masculino','Av. Independencia 100, San Miguel de Tucumán','3814111111','superadmin@hospital.com'),(2,'20222222','María','Directora','1975-03-20','Femenino','Av. Sarmiento 200, San Miguel de Tucumán','3814222222','admin@hospital.com'),(3,'30333333','Ana','Recepción','1990-05-10','Femenino','Calle Maipú 300, San Miguel de Tucumán','3814333333','recepcion@hospital.com'),(4,'25444444','Juan','Pérez','1985-07-25','Masculino','Av. Mate de Luna 400, San Miguel de Tucumán','3814444444','jperez@hospital.com'),(5,'28555555','Laura','Enfermera','1988-09-12','Femenino','Calle San Martín 500, San Miguel de Tucumán','3814555555','lenfermera@hospital.com'),(6,'35666666','Pedro','Paciente','1995-11-30','Masculino','Calle Córdoba 600, San Miguel de Tucumán','3814666666','ppaciente@gmail.com'),(7,'32676767','josefa','perez','1991-12-31','Femenino','calle falsa 123','382737373','juanperez155188@gmail.com'),(8,'12312312','pedro','pedro','1991-12-31','Masculino','calle falsa 123','3423234234','juanperefweez155188@hotmail.com'),(9,'6037637','nora','galvan','1991-12-12',NULL,'calle falsa 123','3817654322','sergiwefoghezzi1991@gmail.com'),(10,'1276556','juan','galvan','1991-12-12',NULL,NULL,'3816735282','sergioghwefvsdfezzi5@gmail.com'),(11,'35456789','Ana','González','1990-05-15','Femenino','Av. Corrientes 1234','+54 11 4567-8900','ana.gonzalez@email.com'),(12,'28456123','Juan','Pérez','1980-03-10','Masculino','Av. Santa Fe 2345','+54 11 4567-8901','juan.perez@hospital.com'),(17,'35001234','Juan','Pérez','1980-05-10','Masculino','Av. Siempreviva 123','3511111111','juanperez@hospital.com'),(18,'32004567','Lucía','Díaz','1985-07-20','Femenino','Bv. San Juan 55','3512222222','luciadiaz@hospital.com'),(19,'36009999','María','Fernández','1990-03-11','Femenino','San Luis 120','3513333333','mariafernandez@hospital.com'),(20,'37008888','Diego','López','1992-11-02','Masculino','Colón 890','3514444444','diegolopez@hospital.com'),(25,'99001234','Juan','Pérez','1980-05-10','Masculino','Av. Siempreviva 123','3511111111','juanperez_medico@hospitaldemo.com'),(26,'98004567','Lucía','Díaz','1985-07-20','Femenino','Bv. San Juan 55','3512222222','luciadiaz_cardiologa@hospitaldemo.com'),(27,'97009999','María','Fernández','1990-03-11','Femenino','San Luis 120','3513333333','mariafernandez_enfermera@hospitaldemo.com'),(28,'96008888','Diego','López','1992-11-02','Masculino','Colón 890','3514444444','diegolopez_recepcionista@hospitaldemo.com'),(29,'1234565','javier','pavon','1991-12-12','Masculino','calle 123','3124232142','sergio@gmail.coom');
/*!40000 ALTER TABLE `personas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 11:02:53
