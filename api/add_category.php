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
$name = trim($data["name"] ?? "");
$type = trim($data["type"] ?? "");

if (!$name || !$type) {
    http_response_code(400);
    echo json_encode(["error" => "Name and type are required"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO categories (userId, name, type) VALUES (?, ?, ?)");
$stmt->execute([$_SESSION["userId"], $name, $type]);

echo json_encode(["success" => true, "id" => (int)$pdo->lastInsertId()]);
?>
