<?php
session_start();
header("Content-Type: application/json");
require "db.php";

if (!isset($_SESSION["userId"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id   = intval($data["id"] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Receipt ID is required"]);
    exit;
}

// Make sure the receipt belongs to the logged in user
$stmt = $pdo->prepare("DELETE FROM receipts WHERE id = ? AND userId = ?");
$stmt->execute([$id, $_SESSION["userId"]]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Receipt not found"]);
    exit;
}

// Items are deleted automatically via ON DELETE CASCADE
echo json_encode(["success" => true]);
?>
