<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "calendar_db";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("DB Connection failed: " . $e->getMessage(), 3, __DIR__ . "/error.log");

    die("مشکلی در اتصال به پایگاه داده پیش آمده. لطفاً بعداً تلاش کنید.");
}
