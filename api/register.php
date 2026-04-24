<?php
session_start();
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username  = trim($data["username"]  ?? "");
$password  = trim($data["password"]      ?? "");
$name      = trim($data["name"]      ?? "");
$currency  = trim($data["currency"]      ?? "RON");

if (!$username || !$password || !$name || !$currency) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

// Insert user
$stmt = $pdo->prepare("INSERT INTO users (username, password, name, currency) VALUES (?, ?, ?, ?)");
$stmt->execute([$username, $password, $name, $currency]);

$userId = $pdo->lastInsertId();

echo json_encode(["success" => true, "userId" => (int)$userId]);
?>