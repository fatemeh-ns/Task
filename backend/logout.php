<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Event.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $token = $data['token'] ?? '';
    if ($token == '') {
        echo json_encode(['status' => 'error', 'message' => 'Token is empty']);
        exit();
    }
    try {
        updateToken($conn, $token);
        echo json_encode([
            'status' => 'ok',
            'message' => 'Token removed successfully'
        ]);
        exit();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
