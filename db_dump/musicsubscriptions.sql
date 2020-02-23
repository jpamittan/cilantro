-- phpMyAdmin SQL Dump
-- version 4.5.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 01, 2016 at 04:56 PM
-- Server version: 5.5.49-0ubuntu0.14.04.1
-- PHP Version: 7.0.8-2+deb.sury.org~trusty+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hermosa`
--

-- --------------------------------------------------------

--
-- Table structure for table `musicsubscriptions`
--

DROP TABLE IF EXISTS `musicsubscriptions`;
CREATE TABLE `musicsubscriptions` (
  `id` int(10) UNSIGNED NOT NULL,
  `cilantro_id` varchar(255) DEFAULT NULL,
  `subscription_date` datetime DEFAULT NULL,
  `is_recurring` int(11) DEFAULT NULL,
  `subscription_id` varchar(255) DEFAULT NULL,
  `os` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `musicsubscriptions`
--
ALTER TABLE `musicsubscriptions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `musicsubscriptions`
--
ALTER TABLE `musicsubscriptions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
