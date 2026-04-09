<?php
session_start();
header("Content-Type: application/json");
require "db.php";

if (!isset($_SESSION["userId"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$data          = json_decode(file_get_contents("php://input"), true);
$merchant      = trim($data["merchant"]      ?? "");
$date          = trim($data["date"]          ?? "");
$category      = trim($data["category"]      ?? "");
$paymentMethod = trim($data["paymentMethod"] ?? "");
$currency      = trim($data["currency"]      ?? "");
$total         = floatval($data["total"]     ?? 0);
$items         = $data["items"]              ?? [];

if (!$merchant || !$date || !$category || !$paymentMethod || !$currency) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

// Insert receipt
$stmt = $pdo->prepare("INSERT INTO receipts (userId, merchant, date, category, paymentMethod, currency, total) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$_SESSION["userId"], $merchant, $date, $category, $paymentMethod, $currency, $total]);
$receiptId = $pdo->lastInsertId();

// Insert items
foreach ($items as $item) {
    $itemStmt = $pdo->prepare("INSERT INTO items (receiptId, name, qty, price) VALUES (?, ?, ?, ?)");
    $itemStmt->execute([$receiptId, $item["name"], $item["qty"], $item["price"]]);
}

echo json_encode(["success" => true, "id" => (int)$receiptId]);
?>
