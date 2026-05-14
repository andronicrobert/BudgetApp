-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 14, 2026 at 06:38 AM
-- Server version: 9.1.0
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

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(123) COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(123) COLLATE utf8mb4_general_ci NOT NULL,
  `budget_limit` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `userId`, `name`, `type`, `budget_limit`) VALUES
(1, 1, 'Food', 'Need', 0.00),
(2, 1, 'Delivery', 'Want', 0.00),
(3, 1, 'Transport', 'Need', 0.00),
(4, 2, 'Food', 'Need', 0.00),
(5, 2, 'Shopping', 'Want', 0.00),
(6, 3, 'Transport', 'Need', 0.00),
(7, 3, 'Entertainment', 'Want', 0.00),
(8, 4, 'Food', 'Need', 0.00),
(9, 4, 'Transport', 'Need', 0.00),
(10, 4, 'Entertainment', 'Want', 0.00),
(11, 5, 'Food', 'Need', 1500.00),
(12, 5, 'Transport', 'Need', 500.00);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receiptId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `qty` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `receiptId` (`receiptId`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `receiptId`, `name`, `qty`, `price`) VALUES
(1, 1, 'Bread', 2, 3.50),
(2, 1, 'Milk', 3, 8.20),
(3, 1, 'Chicken', 1, 32.99),
(4, 2, 'Big Mac Menu', 2, 38.00),
(5, 2, 'McFlurry', 1, 11.50),
(7, 4, 'Jacket', 1, 220.00),
(8, 4, 'T-shirt', 2, 50.00),
(9, 5, 'Vegetables', 1, 30.00),
(10, 5, 'Cheese', 2, 34.20),
(11, 6, 'Monthly subscription', 1, 15.99),
(12, 7, 'Ride', 1, 23.50),
(13, 8, 'Total', 1, 45.00),
(14, 9, 'Total', 1, 100.00),
(15, 10, 'Paine', 1, 6.00),
(16, 10, 'Oua', 10, 1.20),
(17, 10, 'Apa', 1, 4.00),
(18, 11, 'Total', 1, 60.00),
(19, 12, 'Total', 1, 750.00),
(23, 14, 'Eggs', 6, 1.20),
(24, 14, 'Bread', 1, 4.00),
(25, 14, 'Milk', 1, 6.00);

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
CREATE TABLE IF NOT EXISTS `receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `merchant` varchar(123) COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `category` varchar(123) COLLATE utf8mb4_general_ci NOT NULL,
  `paymentMethod` varchar(12) COLLATE utf8mb4_general_ci NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_general_ci NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receipts`
--

INSERT INTO `receipts` (`id`, `userId`, `merchant`, `date`, `category`, `paymentMethod`, `currency`, `total`) VALUES
(1, 1, 'Kaufland', '2026-03-15', 'Food', 'Card', 'RON', 152.30),
(2, 1, 'McDonald\'s', '2026-03-18', 'Delivery', 'Cash', 'RON', 87.50),
(4, 2, 'Zara', '2026-03-10', 'Shopping', 'Card', 'RON', 320.00),
(5, 2, 'Mega Image', '2026-03-22', 'Food', 'Cash', 'RON', 98.40),
(6, 3, 'Netflix', '2026-03-01', 'Entertainment', 'Card', 'EUR', 15.99),
(7, 3, 'Bolt', '2026-03-14', 'Transport', 'Card', 'EUR', 23.50),
(8, 1, 'Uber', '2026-04-03', 'Transport', 'Cash', 'RON', 45.00),
(9, 4, 'Uber', '2026-05-14', 'Transport', 'Card', 'RON', 100.00),
(10, 4, 'Kaufland', '2026-05-11', 'Food', 'Card', 'RON', 22.00),
(11, 4, 'Netflix', '2026-05-01', 'Entertainment', 'Card', 'RON', 60.00),
(12, 5, 'Kaufland', '2026-05-14', 'Food', 'Card', 'RON', 750.00),
(14, 5, 'Lidl', '2026-05-05', 'Food', 'Card', 'RON', 17.20);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(123) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(123) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(123) COLLATE utf8mb4_general_ci NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_general_ci NOT NULL,
  `salary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `budget` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `name`, `currency`, `salary`, `budget`) VALUES
(1, 'john', 'john123', 'John Donovan', 'RON', 5000.00, 3000.00),
(2, 'maria', 'maria123', 'Maria Pop', 'RON', 4200.00, 2500.00),
(3, 'alex', 'alex123', 'Alex Ionescu', 'EUR', 2000.00, 1200.00),
(4, 'george', 'george123', 'George Popescu', 'RON', 2000.00, 1800.00),
(5, 'ionut', 'ionut123', 'Ionut', 'RON', 0.00, 0.00);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`receiptId`) REFERENCES `receipts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
