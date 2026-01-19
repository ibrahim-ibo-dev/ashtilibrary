<?php
// پەیوەندی بە داتابەیس
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'erbil_chess_db';

// دروستکردنی پەیوەندی
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

// دڵنیابوون لە پەیوەندییەکە
if (!$conn) {
    die("پەیوەندی بە داتابەیس شکستی هێنا: " . mysqli_connect_error());
}

// ڕێکخستنی کاراکتەرەکان بۆ پشتگیری کوردی
mysqli_set_charset($conn, "utf8mb4");
?>