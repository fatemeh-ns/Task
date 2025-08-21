<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Event.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $day = intval($_POST['day'] ?? date('j'));
    $month = intval($_POST['month'] + 1 ?? (date('n')) + 1);
    $year = isset($_POST['year']) && !empty($_POST['year']) ? intval($_POST['year']) : date('Y');
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $is_recurring = isset($_POST['is_recurring']) && $_POST['is_recurring'] ? true : false;

    try {
        addEvent($conn, $day, $month, $year, $title, $description, $is_recurring);
        header('Location: /Task/index.php');
        exit();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
