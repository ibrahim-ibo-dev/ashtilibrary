<?php
// وەرگرتنی فەنکشنەکان و دڵنیابوون لە لۆگین
require_once 'admin_functions.php';
$user = checkLoggedIn();

// دیاریکردنی جۆری وەڵامدانەوە
header('Content-Type: application/json');

// دڵنیابوون لە شێوازی ناردن
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // وەرگرتنی ئایدی چالاکی
    $activity_id = isset($_POST['activity_id']) ? (int)$_POST['activity_id'] : 0;
    
    // دڵنیابوون لە بوونی ئایدی
    if (empty($activity_id)) {
        echo json_encode([
            'success' => false,
            'message' => 'ئایدی چالاکی دیاری نەکراوە'
        ]);
        exit;
    }
    
    // سڕینەوەی چالاکی
    $success = deleteActivity($activity_id);
    
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'چالاکی بە سەرکەوتوویی سڕایەوە'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'هەڵەیەک ڕوویدا لە کاتی سڕینەوەی چالاکی'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'شێوازی ناردنی نادروست'
    ]);
}
?>