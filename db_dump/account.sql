-- MySQL dump 10.13  Distrib 5.6.27, for osx10.10 (x86_64)
--
-- Host: localhost    Database: cilantro
-- ------------------------------------------------------
-- Server version	5.6.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `id` varchar(255) DEFAULT NULL,
  `object_id` varchar(255) DEFAULT NULL,
  `msisdn` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `activated` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `object_id` (`object_id`),
  UNIQUE KEY `msisdn` (`msisdn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('0987654321',NULL,'+639082889480','Juan','Santos','dela Cruz',0,'2015-10-14 11:50:55','2015-10-14 11:50:55'),
('12345',NULL,'1001','Juan',NULL,'dela Cruz',0,'2015-10-14 12:04:18','2015-10-14 12:04:18'),
('09876',NULL,'1008','Juan',NULL,'dela Cruz',0,'2015-10-14 12:31:49','2015-10-14 12:31:49'),
('098765','0-2-5-25','1004','Juan',NULL,'dela Cruz',0,'2015-10-14 12:37:14','2015-10-14 12:37:14'),
('23456','0-2-5-20','1003','Juan',NULL,'dela Cruz',0,'2015-10-15 11:36:42','2015-10-15 11:36:42'),
('234512367',NULL,'1000','Juan',NULL,'dela Cruz',0,'2015-10-15 11:56:16','2015-10-15 11:56:16'),
('34567',NULL,'1002','Juan',NULL,'dela Cruz',0,'2015-10-15 14:33:49','2015-10-15 14:33:49'),
('24680','0-2-5-30','1005','Juan',NULL,'dela Cruz',0,'2015-10-16 10:44:37','2015-10-16 10:44:37'),
('64680',NULL,'1006','Juan',NULL,'dela Cruz',0,'2015-10-16 13:20:36','2015-10-16 13:20:36');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-10-27 10:47:38
