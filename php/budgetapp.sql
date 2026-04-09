-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2026 at 02:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` varchar(123) NOT NULL,
  `type` varchar(123) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `userId`, `name`, `type`) VALUES
(1, 1, 'Food', 'Need'),
(2, 1, 'Delivery', 'Want'),
(3, 1, 'Transport', 'Need'),
(4, 2, 'Food', 'Need'),
(5, 2, 'Shopping', 'Want'),
(6, 3, 'Transport', 'Need'),
(7, 3, 'Entertainment', 'Want');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `receiptId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `qty` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(13, 8, 'Total', 1, 45.00);

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `merchant` varchar(123) NOT NULL,
  `date` date NOT NULL,
  `category` varchar(123) NOT NULL,
  `paymentMethod` varchar(12) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(8, 1, 'Uber', '2026-04-03', 'Transport', 'Cash', 'RON', 45.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(123) NOT NULL,
  `password` varchar(123) NOT NULL,
  `name` varchar(123) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `salary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `budget` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `name`, `currency`, `salary`, `budget`) VALUES
(1, 'john', 'john123', 'John Donovan', 'RON', 5000.00, 3000.00),
(2, 'maria', 'maria123', 'Maria Pop', 'RON', 4200.00, 2500.00),
(3, 'alex', 'alex123', 'Alex Ionescu', 'EUR', 2000.00, 1200.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `receiptId` (`receiptId`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
