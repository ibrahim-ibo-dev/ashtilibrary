<?php
// وەرگرتنی فەنکشنەکان و دڵنیابوون لە لۆگین
require_once 'admin_functions.php';
$user = checkLoggedIn();

// دیاریکردنی جۆری وەڵامدانەوە
header('Content-Type: application/json');

// دڵنیابوون لە شێوازی ناردن
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // وەرگرتنی داتاکان
    $activity_id = isset($_POST['activity_id']) ? (int)$_POST['activity_id'] : 0;
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $date = isset($_POST['date']) ? trim($_POST['date']) : date('Y-m-d');
    $video_url = isset($_POST['video_url']) ? trim($_POST['video_url']) : null;
    
    // وەرگرتنی وێنە ئەگەر هەبێت
    $image = isset($_FILES['image']) && $_FILES['image']['error'] !== 4 ? $_FILES['image'] : null;
    
    // دڵنیابوون لە بوونی بەهای پێویست
    if (empty($activity_id) || empty($title) || empty($description)) {
        echo json_encode([
            'success' => false,
            'message' => 'زانیاری پێویست دیاری نەکراوە'
        ]);
        exit;
    }
    
    // دەستکاریکردنی چالاکی
    $success = updateActivity($activity_id, $title, $description, $date, $image, $video_url);
    
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'چالاکی بە سەرکەوتوویی نوێ کرایەوە'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'هەڵەیەک ڕوویدا لە کاتی نوێکردنەوەی چالاکی'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'شێوازی ناردنی نادروست'
    ]);
}
?>