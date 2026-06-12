-- Tạo user với tất cả các host có thể kết nối vào
CREATE USER IF NOT EXISTS 'lqviettt'@'localhost'  IDENTIFIED BY 'secret';
CREATE USER IF NOT EXISTS 'lqviettt'@'127.0.0.1' IDENTIFIED BY 'secret';

-- Cấp toàn quyền trên database gr2
GRANT ALL PRIVILEGES ON gr2.* TO 'lqviettt'@'%';
GRANT ALL PRIVILEGES ON gr2.* TO 'lqviettt'@'localhost';
GRANT ALL PRIVILEGES ON gr2.* TO 'lqviettt'@'127.0.0.1';

-- Áp dụng ngay
FLUSH PRIVILEGES;
