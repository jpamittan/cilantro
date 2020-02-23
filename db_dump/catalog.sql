-- MySQL dump 10.13  Distrib 5.7.9, for osx10.10 (x86_64)
--
-- Host: localhost    Database: hermosa
-- ------------------------------------------------------
-- Server version	5.7.9

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
-- Table structure for table `catalog`
--

DROP TABLE IF EXISTS `catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `offer_group` varchar(255) DEFAULT NULL,
  `offer_name` varchar(255) DEFAULT NULL,
  `offer_external_id` varchar(255) DEFAULT NULL,
  `inclusion` varchar(255) DEFAULT NULL,
  `charge_amount` int(11) DEFAULT NULL,
  `charge_unit` varchar(255) DEFAULT NULL,
  `validity` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog`
--

LOCK TABLES `catalog` WRITE;
/*!40000 ALTER TABLE `catalog` DISABLE KEYS */;
INSERT INTO `catalog` VALUES (1,'BIG BYTES','Big Bytes 5','Big Bytes 5','5MB Open access',5,'PHP','1 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','5MB Open Access','2015-10-27 02:14:38','2015-10-27 02:14:38'),(2,'BIG BYTES','Big Bytes 10','Big Bytes 10','40MB Open Access + 200MB Spinnr',10,'PHP','1 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','40MB Open Access + 200MB Spinnr','2015-10-27 02:14:38','2015-10-27 02:14:38'),(3,'BIG BYTES','Big Bytes 15','Big Bytes 15','40MB Open Access + 300 MB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik',15,'PHP','2 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','40MB Open Access + 300 MB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik','2015-10-27 02:14:38','2015-10-27 02:14:38'),(4,'BIG BYTES','Big Bytes 30','Big Bytes 30','100MB Shareable Open Access*** + 400MB Spinnr',30,'PHP','1 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','100MB Shareable Open Access*** + 400MB Spinnr','2015-10-27 02:14:38','2015-10-27 02:14:38'),(5,'BIG BYTES','Big Bytes 50','Big Bytes 50','700MB Shareable Open Access*** + 600MB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik',50,'PHP','3 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','700MB Shareable Open Access*** + 600MB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik','2015-10-27 02:14:38','2015-10-27 02:14:38'),(6,'BIG BYTES','Big Bytes 70','Big Bytes 70','1GB Shareable Open Access*** + 300MB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik + 1000 TriNet SMS',70,'PHP','7 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','1GB Shareable Open Access*** + 300MB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik + 1000 TriNet SMS','2015-10-27 02:14:38','2015-10-27 02:14:38'),(7,'BIG BYTES','Big Bytes 99','Big Bytes 99','200MB Shareable Open Access*** + 1.1GB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik',99,'PHP','30 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','200MB Shareable Open Access*** + 1.1GB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik','2015-10-27 02:14:38','2015-10-27 02:14:38'),(8,'BIG BYTES','Big Bytes 299','Big Bytes 299','1.7GB Shareable Open Access*** + 1.1GB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik',299,'PHP','30 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','1.7GB Shareable Open Access*** + 1.1GB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik','2015-10-27 02:14:38','2015-10-27 02:14:38'),(9,'BIG BYTES','Big Bytes 799','Big Bytes 799','4.5GB Shareable Open Access*** + 1.1GB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik',799,'PHP','30 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','4.5GB Shareable Open Access*** + 1.1GB for iflix, Spinnr, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik','2015-10-27 02:14:38','2015-10-27 02:14:38'),(10,'SURF MAX','SurfMax 50','SurfMax 50','All-day internet surfing for 1 day',50,'PHP','1 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','All-day internet surfing for 1 day','2015-10-27 02:14:38','2015-10-27 02:14:38'),(11,'SURF MAX','SurfMax 85','SurfMax 85','All-day internet surfing for 2 days',85,'PHP','2 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','All-day internet surfing for 2 days','2015-10-27 02:14:38','2015-10-27 02:14:38'),(12,'SURF MAX','SurfMax 200','SurfMax 200','All-day internet surfing for 5 days',200,'PHP','5 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','All-day internet surfing for 5 days','2015-10-27 02:14:38','2015-10-27 02:14:38'),(13,'SURF MAX','SurfMax 250','SurfMax 250','All-day internet surfing for 7 days',250,'PHP','7 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','All-day internet surfing for 7 days','2015-10-27 02:14:38','2015-10-27 02:14:38'),(14,'SURF MAX','SurfMax 500','SurfMax 500','All-day internet surfing for 15 days',500,'PHP','15 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','All-day internet surfing for 15 days','2015-10-27 02:14:38','2015-10-27 02:14:38'),(15,'SURF MAX','SurfMax 995','SurfMax 995','All-day internet surfing for 30 days',995,'PHP','30 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','All-day internet surfing for 30 days','2015-10-27 02:14:38','2015-10-27 02:14:38'),(16,'FLEXITIME','Flexitime 10','Flexitime 10','1 hour internet browsing For Mindanao Areas only',10,'PHP','1 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','1 hour internet browsing For Mindanao Areas only','2015-10-27 02:14:38','2015-10-27 02:14:38'),(17,'FLEXITIME','Flexitime 20','Flexitime 20','2.5 hours internet browsing',20,'PHP','1 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','2.5 hours internet browsing','2015-10-27 02:14:38','2015-10-27 02:14:38'),(18,'FLEXITIME','Flexitime 30','Flexitime 30','4 hours internet browsing',30,'PHP','1 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','4 hours internet browsing','2015-10-27 02:14:38','2015-10-27 02:14:38'),(19,'FLEXITIME','Flexitime 50','Flexitime 50','7 hours internet browsing',50,'PHP','3 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','7 hours internet browsing','2015-10-27 02:14:38','2015-10-27 02:14:38'),(20,'FLEXITIME','Flexitime 100','Flexitime 100','15 hours internet browsing',100,'PHP','7 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','15 hours internet browsing','2015-10-27 02:14:38','2015-10-27 02:14:38'),(21,'ALL NIGHT BUNDLE','All Night Bundle','All Night Bundle','All-night online surfing. Availment period is from 11PM to 5AM only.',20,'PHP','4 hours','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','All-night online surfing. Availment period is from 11PM to 5AM only','2015-10-27 02:14:38','2015-10-27 02:14:38'),(22,'VIDEO PACKS','YouTube 5','YouTube 5','65MB video streaming for YouTube, Vimeo, Dailymotion, Viewstream & Dubsmash',5,'PHP','1 day','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','65MB video streaming for YouTube, Vimeo, Dailymotion, Viewstream & Dubsmash','2015-10-27 02:14:38','2015-10-27 02:14:38'),(23,'VIDEO PACKS','YouTube 25','YouTube 25','160MB video streaming for YouTube, Vimeo, Dailymotion, Viewstream & Dubsmash',25,'PHP','2 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','160MB video streaming for YouTube, Vimeo, Dailymotion, Viewstream & Dubsmash','2015-10-27 02:14:38','2015-10-27 02:14:38'),(24,'VIDEO PACKS','YouTube 50','YouTube 50','400MB video streaming for YouTube, Vimeo, Dailymotion, Viewstream & Dubsmash',50,'PHP','3 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','400MB video streaming for YouTube, Vimeo, Dailymotion, Viewstream & Dubsmash','2015-10-27 02:14:38','2015-10-27 02:14:38'),(25,'VIDEO PACKS','YouTube 199','YouTube 199','1200MB video streaming for YouTube, Vimeo, Dailymotion, Viewstream & Dubsmash',199,'PHP','30 days','https://s3-us-west-2.amazonaws.com/project-hermosa/products/big_bytes_10.png','1200MB video streaming for YouTube, Vimeo, Dailymotion, Viewstream & Dubsmash','2015-10-27 02:14:38','2015-10-27 02:14:38');
/*!40000 ALTER TABLE `catalog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-02 15:34:40
