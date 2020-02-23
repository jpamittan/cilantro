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
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `device_identifier` varchar(255) DEFAULT NULL,
  `endpoint_arn` varchar(255) DEFAULT NULL,
  `device_os` varchar(255) DEFAULT NULL,
  `account_id` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_identifier` (`device_identifier`),
  UNIQUE KEY `endpoint_arn` (`endpoint_arn`),
  UNIQUE KEY `account_id` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` VALUES (1,'c5u0j4KPJlA:APA91bFw5lZYRWxso3tErhZXPabLBa5-l9AESEfcmBbrzBTnfWtAaIoTJkrtGoKVAGrPpOO6mP-iTzYbRXTGAEqu2QTNKiJAUiz97EK7ZotWYZGqIIKyLwjA7FytvaLmkrgpFV9jx0ny','arn:aws:sns:us-west-2:205181465834:endpoint/GCM/Hermosa-Android/b0f43b6d-8143-3a10-8dd8-369d28b00fd6','android','12345','2015-10-23 11:26:32','2015-10-23 11:26:32'),(2,'coFap-JNSE8:APA91bH8Rdz24ReBHrWaCe8gE1aa00W3Gn44BzrB9Eyd68ZnlY5DbXyVal9-NjhKBDyCRTrEranSbVSzh-8pUMcBmBdcVRJqB4XeM0vBKY6L060qEe1C1q6L3uDGnUooUpZZ2NbakFBX','arn:aws:sns:us-west-2:205181465834:endpoint/GCM/Hermosa-Android/8276614e-5570-35bf-b7fd-17107155b80c','android','00000','2015-10-23 12:23:00','2015-10-23 12:23:00'),(3,'dayydWpnn8w:APA91bGeurrztw-Sm1fw21OfA0NYs--zGXA_t_8M_4rZOqLTY7HwquL6kDlSYdJC1NYz1Nb27sknh5tEg4pXUfmHgQLR6qg6PXB0N30cVvFnVgOaqSPNxVRtObkqXCRjdgS5M8rvyO89','arn:aws:sns:us-west-2:205181465834:endpoint/GCM/Hermosa-Android/bf8e4b34-a6f2-35ab-85d5-8c36798ce8fb','android','11111','2015-10-23 13:27:06','2015-10-23 13:27:06');
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-10-27 13:41:00
