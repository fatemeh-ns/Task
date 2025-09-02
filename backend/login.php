<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Event.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $firstName = $data['first_name'];
    $lastName = $data["last_name"];
    $pass = $data["password"];
    $email = $data["email"];
    $token = bin2hex(random_bytes(16));


    try {

        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            echo json_encode([
                'status' => 'error',
                'message' => 'این ایمیل قبلا ثبت شده است.'
            ]);
            exit();
        }

        addUser($conn, $firstName, $lastName, $email, $pass, $token);
        echo json_encode([
            'status' => 'ok',
            "token"  => $token,
            'userInfo' => [
                'first_name' => $firstName,
                'last_name'  => $lastName
            ]
        ]);
        exit();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
