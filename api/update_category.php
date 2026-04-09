<?php
session_start();
header("Content-Type: application/json");
require "db.php";

if (!isset($_SESSION["userId"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$data    = json_decode(file_get_contents("php://input"), true);
$id      = intval($data["id"]   ?? 0);
$name    = trim($data["name"]   ?? "");
$type    = trim($data["type"]   ?? "");
$oldName = trim($data["oldName"] ?? "");

if (!$id || !$name || !$type) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

// Update category
$stmt = $pdo->prepare("UPDATE categories SET name=?, type=? WHERE id=? AND userId=?");
$stmt->execute([$name, $type, $id, $_SESSION["userId"]]);

// Update receipts that used the old category name
if ($oldName && $oldName !== $name) {
    $stmt = $pdo->prepare("UPDATE receipts SET category=? WHERE category=? AND userId=?");
    $stmt->execute([$name, $oldName, $_SESSION["userId"]]);
}

echo json_encode(["success" => true]);
?>
