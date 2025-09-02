<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Event.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $email = $data["email"];
    $pass = $data["password"];
    $token = bin2hex(random_bytes(16));


    try {
        $user = signin($conn, $email, $pass, $token);

        if (!$user) {
            echo json_encode([
                'status' => 'error',
                'message' => 'کاربر یافت نشد یا رمز اشتباه است'
            ]);
            exit();
        }

        echo json_encode([
            'status' => 'ok',
            'token' => $user['token'],
            'userInfo' => [
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name']
            ]
        ]);
        exit();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
