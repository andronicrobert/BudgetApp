<?php
session_start();
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data["username"] ?? "");
$password = trim($data["password"] ?? "");

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Username and password are required"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || $user["password"] !== $password) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid username or password"]);
    exit;
}

// Store user id in session
$_SESSION["userId"] = $user["id"];

// Return user data (never return password)
echo json_encode([
    "id"       => $user["id"],
    "username" => $user["username"],
    "name"     => $user["name"],
    "currency" => $user["currency"],
    "salary"   => $user["salary"],
    "budget"   => $user["budget"]
]);
?>
