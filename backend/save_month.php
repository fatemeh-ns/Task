<?php
session_start();
header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true); 

if (isset($data['month'])) {
    $_SESSION['selectedMonth'] = $data['month'];
    echo json_encode([
        "status" => "ok",
        "month" => $_SESSION['selectedMonth']
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "ماه ارسال نشده"
    ]);
}
