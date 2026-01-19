<?php
// فایلی پەیوەندی بە داتابەیس و فەنکشنەکان
require_once 'admin_functions.php';

// دڵنیابوون لە شێوازی ناردن
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // وەرگرتنی داتاکان
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    // دڵنیابوون لە بوونی بەها
    if (empty($username) || empty($password)) {
        // گەڕانەوە بۆ پەیجی لۆگین بە هەڵە
        header("Location: ../admin_login.html?error=empty_fields");
        exit;
    }
    
    // هەوڵدان بۆ لۆگین
    if (login($username, $password)) {
        // سەرکەوتوو - گواستنەوە بۆ پەیجی ئەدمین
        header("Location: ../admin_panel.html");
        exit;
    } else {
        // شکست - گەڕانەوە بۆ پەیجی لۆگین بە هەڵە
        header("Location: ../admin_login.html?error=invalid_credentials");
        exit;
    }
} else {
    // گەڕانەوە بۆ پەیجی لۆگین ئەگەر دەست بە شێوازی دروست نەدرابێت
    header("Location: ../admin_login.html");
    exit;
}
?>