<?php
// پەیوەندی بە داتابەیس
require_once 'database.php';

// دیاریکردنی جۆری وەڵامدانەوە وەک JSON
header('Content-Type: application/json');

// وەرگرتنی سنوور ئەگەر هەبێت
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

// دروستکردنی کوێری
$query = "SELECT id, title, description, image, video_url, date FROM activities ORDER BY date DESC";

// زیادکردنی سنوور ئەگەر هەبێت
if ($limit && $limit > 0) {
    $query .= " LIMIT $limit";
}

// ناردنی کوێری
$result = mysqli_query($conn, $query);

// ئامادەکردنی ئەرەی بۆ داتاکان
$activities = [];

// خوێندنەوەی ئەنجامەکان
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // زیادکردن بۆ لیستی چالاکییەکان
        $activities[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'image' => $row['image'],
            'video_url' => $row['video_url'],
            'date' => $row['date']
        ];
    }
}

// گەڕاندنەوەی داتاکان وەک JSON
echo json_encode($activities);
?>