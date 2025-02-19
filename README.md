Pull code về:
- Cài docker, composer, npm, mysql nếu chưa có
- Cách chạy BackEnd:
  + cd vào backend/project-laravel-gr2
  + Thông tin mysql ở trong mục app/env
  + Cấu hình file .env đúng với tài khoản mysql, các thông tin khác như tài khoản gửi mail, thanh toán VNpay( nếu cần)...
  + chạy lệnh composer update
  + chạy tiếp docker-composer up -d
  + Sau đó có thể truy cập 127.0.0.1:9000
- Cách chạy FrontEnd:
  + cd vào frontend/project-react-gr2
  + Chạy lệnh npm update, npm install, npm start
-> Done
