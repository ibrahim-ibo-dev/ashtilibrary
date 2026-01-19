-- دروستکردنی داتابەیس بۆ ئەکادێمیای شەترەنجی هەولێر
CREATE DATABASE IF NOT EXISTS erbil_chess_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE erbil_chess_db;

-- خشتەی بەکارهێنەران (ئەدمینەکان)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- خشتەی چالاکییەکان
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    video_url VARCHAR(255),
    date DATE NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- خشتەی وێنەکانی چالاکییەکان (هەر چالاکییەک چەند وێنەیەکی هەبێت)
CREATE TABLE IF NOT EXISTS activity_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- دروستکردنی یەکەم ئەدمین (پاسۆرد: admin123)
INSERT INTO users (username, password, fullname, email, role) 
VALUES ('admin', '$2y$10$5HO0LAlLFRf/PBpqXVLkPOuKQhYKehYVYOEQF1PnPcTZYn5UMjDQi', 'ئەدمینی سەرەکی', 'erbilchessacademy@gmail.com', 'admin');