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
$receiptId     = intval($data["id"] ?? 0);
$merchant      = trim($data["merchant"]      ?? "");
$date          = trim($data["date"]          ?? "");
$category      = trim($data["category"]      ?? "");
$paymentMethod = trim($data["paymentMethod"] ?? "");
$currency      = trim($data["currency"]      ?? "");
$total         = floatval($data["total"]     ?? 0);
$items         = $data["items"]              ?? [];

if (!$receiptId || !$merchant || !$date || !$category || !$paymentMethod || !$currency) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

// Use a transaction to ensure atomicity
$pdo->beginTransaction();

try {
    // 1. Verify the receipt belongs to the user and update it
    $stmt = $pdo->prepare(
        "UPDATE receipts 
         SET merchant=?, date=?, category=?, paymentMethod=?, currency=?, total=? 
         WHERE id=? AND userId=?"
    );
    $stmt->execute([$merchant, $date, $category, $paymentMethod, $currency, $total, $receiptId, $_SESSION["userId"]]);

    // Check if the update was successful (if the receipt existed and belonged to the user)
    if ($stmt->rowCount() === 0) {
        throw new Exception("Receipt not found or permission denied.", 404);
    }

    // 2. Delete old items for this receipt
    $stmt = $pdo->prepare("DELETE FROM items WHERE receiptId = ?");
    $stmt->execute([$receiptId]);

    // 3. Insert new items
    foreach ($items as $item) {
        $itemStmt = $pdo->prepare("INSERT INTO items (receiptId, name, qty, price) VALUES (?, ?, ?, ?)");
        $itemStmt->execute([$receiptId, $item["name"], $item["qty"], $item["price"]]);
    }

    // If all good, commit the transaction
    $pdo->commit();
    echo json_encode(["success" => true, "id" => $receiptId]);

} catch (Exception $e) {
    // Something went wrong, rollback the transaction
    $pdo->rollBack();
    $code = $e->getCode() == 404 ? 404 : 500;
    http_response_code($code);
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}
?>