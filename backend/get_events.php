<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Event.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$month = isset($data['month']) ? intval($data['month']) : null;
$year  = isset($data['year'])  ? intval($data['year']) : null;
$token = $data["token"];

if ($month < 1 || $month > 12) {
    echo json_encode([
        'error' => 'ماه نامعتبر است.'
    ]);
    exit;
}

try {
    $events = getEventsByMonth($conn, $month, $year, $token);
    echo json_encode($events, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
