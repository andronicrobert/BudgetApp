<?php
session_start();
header("Content-Type: application/json");
require "db.php";

if (!isset($_SESSION["userId"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM categories WHERE userId = ? ORDER BY name ASC");
$stmt->execute([$_SESSION["userId"]]);
$categories = $stmt->fetchAll();

foreach ($categories as &$cat) {
    $cat["id"]     = (int)$cat["id"];
    $cat["userId"] = (int)$cat["userId"];
}

echo json_encode($categories);
?>
