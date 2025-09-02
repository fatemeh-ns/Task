<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Event.php';

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $day = intval($data['day'] ?? date('j'));
    $month = intval($data['month'] + 1 ?? (date('n')) + 1);
    $year = isset($data['year']) && !empty($data['year']) ? intval($data['year']) : intval(date("Y"));
    $title = trim($data['title'] ?? '');
    $description = trim($data['description'] ?? '');
    $is_recurring = !empty($data['is_recurring']);
    $token = $data['token'];

    try {
        addEvent($conn, $day, $month, $year, $title, $description, $is_recurring, $token);
        echo json_encode(['status' => 'ok']);
        exit();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
