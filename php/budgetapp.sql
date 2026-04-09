-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Apr 09, 2026 at 06:36 AM
-- Server version: 11.5.2-MariaDB
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `budgetapp`
--

# create DATABASE if not EXISTS budgetapp;
# use budgetapp;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` varchar(123) NOT NULL,
  `type` varchar(123) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `userId`, `name`, `type`) VALUES
(1, 1, 'Food', 'Need'),
(2, 1, 'Take-out', 'Want'),
(3, 1, 'Transport', 'Need'),
(4, 2, 'Food', 'Need'),
(5, 2, 'Shopping', 'Want'),
(6, 3, 'Transport', 'Need'),
(7, 3, 'Entertainment', 'Want');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
CREATE TABLE IF NOT EXISTS `receipts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `merchant` varchar(123) NOT NULL,
  `date` date NOT NULL,
  `category` varchar(123) NOT NULL,
  `paymentMethod` varchar(12) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `total` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `username` varchar(123) NOT NULL,
  `password` varchar(123) NOT NULL,
  `name` varchar(123) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `salary` int(11) NOT NULL,
  `budget` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `name`, `currency`, `salary`, `budget`) VALUES
(1, 'john', 'john123', 'John Doe', 'RON', 5000, 3000),
(2, 'maria', 'maria123', 'Maria Pop', 'RON', 4200, 2500),
(3, 'alex', 'alex123', 'Alex Ionescu', 'EUR', 2000, 1200);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
