<?php
// وەرگرتنی فەنکشنەکان و دڵنیابوون لە لۆگین
require_once 'admin_functions.php';
$user = checkLoggedIn();

// دیاریکردنی جۆری وەڵامدانەوە
header('Content-Type: application/json');

// دڵنیابوون لە شێوازی ناردن
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // وەرگرتنی داتاکان
    
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $date = isset($_POST['date']) ? trim($_POST['date']) : date('Y-m-d');
    $video_url = isset($_POST['video_url']) ? trim($_POST['video_url']) : null;
    
    // وەرگرتنی وێنە ئەگەر هەبێت
    $image = isset($_FILES['image']) ? $_FILES['image'] : null;
    
    // دڵنیابوون لە بوونی بەهای پێویست
    if (empty($title) || empty($description)) {
        echo json_encode([
            'success' => false,
            'message' => 'تکایە سەردێڕ و وەسف پڕ بکەرەوە'
        ]);
        exit;
    }
    
    // زیادکردنی چالاکی
    $activity_id = addActivity($title, $description, $date, $image, $video_url);
    
    if ($activity_id) {
        echo json_encode([
            'success' => true,
            'activity_id' => $activity_id,
            'message' => 'چالاکی بە سەرکەوتوویی زیاد کرا'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'هەڵەیەک ڕوویدا لە کاتی زیادکردنی چالاکی'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'شێوازی ناردنی نادروست'
    ]);
}
?>