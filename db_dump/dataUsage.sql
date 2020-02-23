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
-- Table structure for table `datausage`
--

DROP TABLE IF EXISTS `datausage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datausage` (
  `id` varchar(255) DEFAULT NULL,
  `account_id` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `usage_value` varchar(255) DEFAULT NULL,
  `usage_unit` varchar(255) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datausage`
--

LOCK TABLES `datausage` WRITE;
/*!40000 ALTER TABLE `datausage` DISABLE KEYS */;
INSERT INTO `datausage` VALUES 
('1','234512367','App Meter 1','10-10-19','100','MB'),
('2','234512367','App Meter 2','10-10-19','101','MB'),
('3','234512367','App Meter 3','10-10-19','102','MB'),
('4','234512367','App Meter 4','10-10-19','103','MB'),
('5','234512367','App Meter 5','10-10-19','104','MB'),
('6','234512367','App Meter 1','10-10-19','105','MB'),
('7','234512367','App Meter 2','10-10-19','106','MB'),
('8','234512367','App Meter 3','10-10-19','107','MB'),
('9','234512367','App Meter 4','10-10-20','108','MB'),
('10','234512367','App Meter 5','10-10-20','109','MB'),
('11','234512367','App Meter 1','10-10-20','100','MB'),
('12','234512367','App Meter 2','10-10-20','111','MB'),
('13','234512367','App Meter 3','10-10-20','112','MB'),
('14','234512367','App Meter 4','10-10-20','113','MB'),
('15','234512367','App Meter 5','10-10-20','114','MB');



/*!40000 ALTER TABLE `datausage` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-10-13 18:00:43
