<?php
require_once('./config.php');

function getEventsByMonth($conn, $month, $year = null)
{
    try {
        $query = "SELECT id, title, description, day, month, year, is_recurring, is_holiday
                  FROM events 
                  WHERE month = :month 
                  AND (year = :year OR year IS NULL OR is_recurring = 1)";

        $statement = $conn->prepare($query);
        $statement->bindValue("month", $month);
        $statement->bindValue('year', $year ?? null);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        throw new Exception("Error fetching events: " . $e->getMessage());
    }
}


function addEvent(PDO $conn, int $day, int $month, int $year, string $title, string $description, bool $is_recurring = true): bool
{
    $query = "INSERT INTO events (day, month, year, title, description, is_recurring) 
              VALUES (:day, :month, :year, :title, :description, :is_recurring)";
    
    $statement = $conn->prepare($query);
    
    return $statement->execute([
        ':day' => $day,
        ':month' => $month,
        ':year' => $year,
        ':title' => $title,
        ':description' => $description,
        ':is_recurring' => $is_recurring ? 1 : 0
    ]);
}

