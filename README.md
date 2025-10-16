Pull code về:
- Cài docker, composer, npm, mysql, php nếu chưa có
- Cách chạy BackEnd:
  + cd vào backend/project-laravel-gr2
  + Thông tin mysql ở trong mục app/env
  + Tạo file .env từ file .env.example, cấu hình file .env đúng với tài khoản mysql, các thông tin khác như tài khoản gửi mail, thanh toán VNpay( nếu cần)...
  + mở vendor/nwidart/laravel-modules/src/Commands/BaseCommand.php: ẩn dòng  use Prohibitable;
  + chạy docker-compose up -d
  + Sau khi chạy xong. 
  + Nếu dùng Windows mở docker desktop-> chọn container đang chạy và vào image api->exec gõ lệnh cd /var/www và cấp quyền 777 cho file storage/logs/laravel.log
  +Nếu dùng ubuntu: docker exec -it api bash, sau đó cấp quền : chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache và chmod -R 775 /var/www/storage /var/www/bootstrap/cache
  + Vào đường dẫn 127.0.0.1:9000 được là oke
- Tạo database sau khi chạy BackEnd xong:
  + Mở mysql và kết nối tới tài khoản và password như trong file env
  + import file DB_GR2.sql vào
  + Là xong 
- Cách chạy FrontEnd:
  + cd vào frontend/project-react-gr2
  + Chạy lệnh npm update, npm install, npm start
-> Done
