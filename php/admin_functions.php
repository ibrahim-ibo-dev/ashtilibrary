<?php
// فایلی پەیوەندی بە داتابەیس
require_once 'database.php';

// فەنکشنی لۆگینی ئەدمین
function login($username, $password) {
    global $conn;
    
    // پاککردنەوەی ناوی بەکارهێنەر بۆ پاراستن لە SQL Injection
    $username = mysqli_real_escape_string($conn, $username);
    
    // گەڕان بەدوای بەکارهێنەر
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) === 1) {
        $user = mysqli_fetch_assoc($result);
        
        // دڵنیابوون لە پاسۆرد
        if (password_verify($password, $user['password'])) {
            // دەستپێکردنی سیشن
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['fullname'] = $user['fullname'];
            $_SESSION['role'] = $user['role'];
            
            return true;
        }
    }
    
    return false;
}

// فەنکشنی زیادکردنی چالاکی نوێ
function addActivity($title, $description, $date, $image = null, $video_url = null) {
    global $conn;
    
    // پاککردنەوەی داتاکان
    $title = mysqli_real_escape_string($conn, $title);
    $description = mysqli_real_escape_string($conn, $description);
    $date = mysqli_real_escape_string($conn, $date);
    $video_url = $video_url ? mysqli_real_escape_string($conn, $video_url) : null;
    
    // وەرگرتنی ئایدی ئەدمین لە سیشن
    session_start();
    $created_by = $_SESSION['user_id'];
    
    // زیادکردنی چالاکی بە بێ وێنە بە پێشفەرز
    $image_path = 'images/default-activity.jpg';
    
    // بەڕێوەبردنی ئاپلۆدکردنی وێنە ئەگەر هەبێت
    if ($image && $image['error'] === 0) {
        $target_dir = "../uploads/";
        
        // دروستکردنی ناوی فایلی نوێ بۆ ڕێگرتن لە دووبارەبوونەوە
        $file_extension = pathinfo($image['name'], PATHINFO_EXTENSION);
        $new_filename = uniqid() . '.' . $file_extension;
        $target_file = $target_dir . $new_filename;
        
        // دڵنیابوون لە جۆری فایل
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
        if (in_array(strtolower($file_extension), $allowed_types)) {
            if (move_uploaded_file($image['tmp_name'], $target_file)) {
                $image_path = 'uploads/' . $new_filename;
            }
        }
    }
    
    // زیادکردن بۆ داتابەیس
    $video_part = $video_url ? ", '$video_url'" : ", NULL";
    $query = "INSERT INTO activities (title, description, date, image, video_url, created_by) 
              VALUES ('$title', '$description', '$date', '$image_path' $video_part, $created_by)";
    
    if (mysqli_query($conn, $query)) {
        return mysqli_insert_id($conn); // گەڕاندنەوەی ئایدی چالاکی
    }
    
    return false;
}

// فەنکشنی سڕینەوەی چالاکی
function deleteActivity($activity_id) {
    global $conn;
    
    // دڵنیابوون لە ژمارەیی بوون
    $activity_id = (int)$activity_id;
    
    // وەرگرتنی زانیاری وێنە پێش سڕینەوە
    $query = "SELECT image FROM activities WHERE id = $activity_id";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) === 1) {
        $activity = mysqli_fetch_assoc($result);
        
        // سڕینەوە لە داتابەیس
        $delete_query = "DELETE FROM activities WHERE id = $activity_id";
        if (mysqli_query($conn, $delete_query)) {
            // سڕینەوەی فایلی وێنە ئەگەر وێنەیەکی تایبەت بوو
            if ($activity['image'] && $activity['image'] !== 'images/default-activity.jpg' && file_exists('../' . $activity['image'])) {
                unlink('../' . $activity['image']);
            }
            return true;
        }
    }
    
    return false;
}

// فەنکشنی دەستکاریکردنی چالاکی
function updateActivity($activity_id, $title, $description, $date, $image = null, $video_url = null) {
    global $conn;
    
    // پاککردنەوەی داتاکان
    $activity_id = (int)$activity_id;
    $title = mysqli_real_escape_string($conn, $title);
    $description = mysqli_real_escape_string($conn, $description);
    $date = mysqli_real_escape_string($conn, $date);
    $video_url = $video_url ? mysqli_real_escape_string($conn, $video_url) : null;
    
    // وەرگرتنی زانیاری چالاکی ئێستا
    $query = "SELECT image FROM activities WHERE id = $activity_id";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) !== 1) {
        return false;
    }
    
    $activity = mysqli_fetch_assoc($result);
    $image_path = $activity['image']; // وێنەی ئێستا
    
    // بەڕێوەبردنی ئاپلۆدکردنی وێنەی نوێ ئەگەر هەبێت
    if ($image && $image['error'] === 0) {
        $target_dir = "../uploads/";
        
        // دروستکردنی ناوی فایلی نوێ بۆ ڕێگرتن لە دووبارەبوونەوە
        $file_extension = pathinfo($image['name'], PATHINFO_EXTENSION);
        $new_filename = uniqid() . '.' . $file_extension;
        $target_file = $target_dir . $new_filename;
        
        // دڵنیابوون لە جۆری فایل
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
        if (in_array(strtolower($file_extension), $allowed_types)) {
            if (move_uploaded_file($image['tmp_name'], $target_file)) {
                // سڕینەوەی وێنەی کۆن ئەگەر پێویست بێت
                if ($image_path && $image_path !== 'images/default-activity.jpg' && file_exists('../' . $image_path)) {
                    unlink('../' . $image_path);
                }
                $image_path = 'uploads/' . $new_filename;
            }
        }
    }
    
    // نوێکردنەوە لە داتابەیس
    $video_part = $video_url !== null ? ", video_url = '$video_url'" : "";
    $query = "UPDATE activities 
              SET title = '$title', description = '$description', date = '$date', image = '$image_path' $video_part
              WHERE id = $activity_id";
    
    if (mysqli_query($conn, $query)) {
        return true;
    }
    
    return false;
}

// فەنکشنی وەرگرتنی هەموو چالاکییەکان
function getAllActivities() {
    global $conn;
    
    $query = "SELECT a.*, u.fullname as creator 
              FROM activities a 
              LEFT JOIN users u ON a.created_by = u.id 
              ORDER BY a.date DESC";
    $result = mysqli_query($conn, $query);
    
    $activities = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $activities[] = $row;
        }
    }
    
    return $activities;
}

// فەنکشنی وەرگرتنی چالاکییەک بە ئایدی
function getActivityById($activity_id) {
    global $conn;
    
    $activity_id = (int)$activity_id;
    $query = "SELECT * FROM activities WHERE id = $activity_id";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) === 1) {
        return mysqli_fetch_assoc($result);
    }
    
    return false;
}

// فەنکشنی دڵنیابوون لە دەرچوون
function logout() {
    session_start();
    session_unset();
    session_destroy();
    
    // گەڕانەوە بۆ پەیجی لۆگین
    header("Location: ../admin_login.html");
    exit;
}

// فەنکشنی دڵنیابوون لە لۆگین کردن
function checkLoggedIn() {
    session_start();
    
    if (!isset($_SESSION['user_id'])) {
        // گەڕانەوە بۆ پەیجی لۆگین
        header("Location: ../admin_login.html");
        exit;
    }
    
    return $_SESSION;
}
?>