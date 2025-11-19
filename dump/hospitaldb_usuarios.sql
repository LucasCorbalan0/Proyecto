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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'superadmin','$2b$10$rKJ5WzJQX8qY5Z3Z3Z3Z3uK5Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z',1,1,1),(2,'admin','$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',2,2,1),(3,'recepcionista','$2b$10$rKJ5WzJQX8qY5Z3Z3Z3Z3uK5Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z',3,3,1),(4,'drperez','$2b$10$rKJ5WzJQX8qY5Z3Z3Z3Z3uK5Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z',4,4,1),(5,'enfermera','$2b$10$rKJ5WzJQX8qY5Z3Z3Z3Z3uK5Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z',5,5,1),(6,'paciente','$2b$10$rKJ5WzJQX8qY5Z3Z3Z3Z3uK5Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z',6,6,1),(7,'josefa','$2b$10$VcYJXSc6OZHriRz6UjdmauqyhQplD.7h.qrxhjN2lTFDSsjBJQ21e',7,2,1),(8,'pedro123','$2b$10$nQjsFiZW.LM6P6O4Dj3T7uZ6P562KgYW0XyAghlQKSqFXAHc2dec2',8,6,1),(9,'nora','$2b$10$mLzikLjY5JsbcVLF/gdPte26dm/b5Hkc4bIOpUwiSpBwFjW5dGney',9,6,1),(10,'juan','$2b$10$c4ez58N7sn7vsEdUEurrFOjIMXU1NcHu6boAWbC2eJ1FNnlvXILF2',10,6,1),(11,'ana.gonzalez','$2b$10$X8DQE0nKE8RyHB8jgZ9Qk.y95HVH7rrylpWJ91H3TZeqF0HQ5Hspy',11,6,1),(12,'javier','$2b$10$isT3e7qwPVdLa/jxVHSJi.7b.YanDdwS3VI22SxexL17cIafykacO',29,6,1);
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

-- Dump completed on 2025-11-13 11:03:10
