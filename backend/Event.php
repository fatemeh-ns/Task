<?php
require_once __DIR__ . '/config.php';

function getEventsByMonth($conn, $month, $year = null, $token)
{
    try {

        $query1 = "SELECT id FROM users WHERE  token = :token";
        $statement = $conn->prepare($query1);
        $statement->bindValue("token", $token);
        $statement->execute();
        $user = $statement->fetch(PDO::FETCH_ASSOC);
        $user_id = $user ? $user['id'] : null;



        $query = "SELECT id, title, description, day, month, year, is_recurring, is_holiday, user_id
                  FROM events 
                  WHERE month = :month 
                  AND (year = :year OR year IS NULL OR is_recurring = 1)
                  AND (user_id = :user_id OR user_id IS NULL)";

        $statement = $conn->prepare($query);
        $statement->bindValue("month", $month);
        $statement->bindValue('year', $year, is_null($year) ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $statement->bindValue('user_id', $user_id, is_null($user_id) ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        throw new Exception("Error fetching events: " . $e->getMessage());
    }
}

function checkToken($conn, $token)
{
    try {
        $query = "SELECT first_name, last_name FROM users WHERE token = :token";
        $statement = $conn->prepare($query);
        $statement->bindValue("token", $token);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        throw new Exception("Error fetching events: " . $e->getMessage());
    }
}

function updateToken($conn, $token)
{
    try {
        $query = "UPDATE users SET token = NULL WHERE token =:token";
        $statement = $conn->prepare($query);
        $statement->bindValue("token", $token);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        throw new Exception("Error fetching events: " . $e->getMessage());
    }
}


function addEvent(PDO $conn, int $day, int $month, int $year, string $title, string $description, bool $is_recurring = true, string $token): bool
{
    $query1 = "SELECT id FROM users WHERE  token = :token";
    $statement = $conn->prepare($query1);
    $statement->bindValue("token", $token);
    $statement->execute();
    $user = $statement->fetch(PDO::FETCH_ASSOC);


    $query = "INSERT INTO events (day, month, year, title, description, is_recurring, user_id) 
              VALUES (:day, :month, :year, :title, :description, :is_recurring, :user_id)";

    $statement = $conn->prepare($query);

    return $statement->execute([
        ':day' => $day,
        ':month' => $month,
        ':year' => $year,
        ':title' => $title,
        ':description' => $description,
        ':is_recurring' => $is_recurring ? 1 : 0,
        ':user_id' => $user['id']
    ]);
}


function addUser(PDO $conn, string $first_name, string $last_name, string $email, int $pass, string $token)
{
    try {
        $query = "INSERT INTO users (first_name, last_name, password, email, token) 
              VALUES (:first_name, :last_name, :password, :email, :token)";

        $statement = $conn->prepare($query);
        $statement->bindValue("first_name", $first_name);
        $statement->bindValue('last_name', $last_name);
        $statement->bindValue('password', $pass);
        $statement->bindValue('email', $email);
        $statement->bindValue('token', $token);
        $statement->execute();
    } catch (PDOException $e) {
        throw new Exception("Error fetching events: " . $e->getMessage());
    }
}


function signin(PDO $conn, string $email, int $pass, string $token)
{
    try {
        $query = "SELECT id, first_name, last_name FROM users WHERE email = :email AND password = :password";
        $statement = $conn->prepare($query);
        $statement->bindValue(":email", $email);
        $statement->bindValue(":password", $pass);
        $statement->execute();
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return false;
        }

        $query2 = "UPDATE users SET token = :token WHERE id = :id";
        $statement2 = $conn->prepare($query2);
        $statement2->bindValue(":token", $token);
        $statement2->bindValue(":id", $user['id']);
        $statement2->execute();
        return [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'token' => $token
        ];
    } catch (PDOException $e) {
        return ['error' => $e->getMessage()];
    }
}
