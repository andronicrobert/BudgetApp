<?php
session_start();
header("Content-Type: application/json");
require "db.php";

if (!isset($_SESSION["userId"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$data     = json_decode(file_get_contents("php://input"), true);
$name     = trim($data["name"]     ?? "");
$username = trim($data["username"] ?? "");
$password = trim($data["password"] ?? "");
$currency = trim($data["currency"] ?? "");
$salary   = floatval($data["salary"] ?? 0);
$budget   = floatval($data["budget"] ?? 0);

if (!$name || !$username || !$password || !$currency) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET name=?, username=?, password=?, currency=?, salary=?, budget=? WHERE id=?");
$stmt->execute([$name, $username, $password, $currency, $salary, $budget, $_SESSION["userId"]]);

echo json_encode(["success" => true]);
?>
