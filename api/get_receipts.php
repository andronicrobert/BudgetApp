<?php
session_start();
header("Content-Type: application/json");
require "db.php";

if (!isset($_SESSION["userId"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$userId = $_SESSION["userId"];

// Get all receipts for the user
$stmt = $pdo->prepare("SELECT * FROM receipts WHERE userId = ? ORDER BY date DESC");
$stmt->execute([$userId]);
$receipts = $stmt->fetchAll();

// For each receipt, get its items
foreach ($receipts as &$receipt) {
    $itemStmt = $pdo->prepare("SELECT name, qty, price FROM items WHERE receiptId = ?");
    $itemStmt->execute([$receipt["id"]]);
    $receipt["items"] = $itemStmt->fetchAll();

    // Cast types so JS gets numbers not strings
    $receipt["id"]    = (int)$receipt["id"];
    $receipt["userId"] = (int)$receipt["userId"];
    $receipt["total"] = (float)$receipt["total"];

    foreach ($receipt["items"] as &$item) {
        $item["qty"]   = (int)$item["qty"];
        $item["price"] = (float)$item["price"];
    }
}

echo json_encode($receipts);
?>
