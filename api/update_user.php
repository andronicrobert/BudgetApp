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
$password = $data["password"] ?? "";
$password = is_string($password) ? trim($password) : "";
if ($password === "undefined") {
    $password = "";
}
$currency     = trim($data["currency"] ?? "");
$salary       = floatval($data["salary"] ?? 0);
$budget       = floatval($data["budget"] ?? 0);
$needsBudget  = floatval($data["needs_budget"] ?? 0);
$wantsBudget  = floatval($data["wants_budget"] ?? 0);

if (!$name || !$username || !$currency) {
    http_response_code(400);
    echo json_encode(["error" => "Name, username, and currency are required"]);
    exit;
}

$sql = "UPDATE users SET name=?, username=?, currency=?, salary=?, budget=?, needs_budget=?, wants_budget=?";
$params = [$name, $username, $currency, $salary, $budget, $needsBudget, $wantsBudget];

if ($password !== "") {
    $sql .= ", password=?";
    $params[] = $password;
}

$sql .= " WHERE id=?";
$params[] = $_SESSION["userId"];

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode(["success" => true]);
?>
