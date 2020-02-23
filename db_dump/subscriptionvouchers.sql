-- phpMyAdmin SQL Dump
-- version 4.5.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 01, 2016 at 04:59 PM
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
-- Table structure for table `subscriptionvouchers`
--

DROP TABLE IF EXISTS `subscriptionvouchers`;
CREATE TABLE `subscriptionvouchers` (
  `id` int(10) UNSIGNED NOT NULL,
  `voucher_name` varchar(255) DEFAULT NULL,
  `voucher_code` varchar(255) DEFAULT NULL,
  `cilantro_id` varchar(255) DEFAULT NULL,
  `is_redeemed` int(11) DEFAULT NULL,
  `date_redeemed` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `subscriptionvouchers`
--
ALTER TABLE `subscriptionvouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `voucher_code` (`voucher_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `subscriptionvouchers`
--
ALTER TABLE `subscriptionvouchers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
