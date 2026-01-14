# Dự Án GR2 Laravel React

Dự án này bao gồm API backend Laravel và ứng dụng frontend React, được container hóa với Docker để dễ dàng phát triển và triển khai.

## Yêu Cầu Hệ Thống

- Docker và Docker Compose
- Git

## Bắt Đầu

### 1. Clone Repository

```bash
git clone https://github.com/lqviettt/gr2-laravel-react.git
```

### 2. Thiết Lập Backend (Laravel API)

1. Di chuyển vào thư mục backend:
   ```bash
   cd backend/project-laravel-gr2
   ```

2. Sao chép và cấu hình file môi trường:
   ```bash
   cp .env.example .env
   ```
   Chỉnh sửa `.env` với cấu hình của bạn:
   - Database: `DB_DATABASE=gr2`, `DB_USERNAME=lqviettt`, `DB_PASSWORD=secret`
   - Cài đặt mail, thông tin VNPay, v.v. nếu cần

3. Sửa lỗi tương thích trong package modules:
   - Mở `vendor/nwidart/laravel-modules/src/Commands/BaseCommand.php`
   - Comment hoặc xóa dòng: `use Prohibitable;`

4. Khởi động các container Docker:
   ```bash
   docker-compose up -d --build
   ```

5. Ứng dụng sẽ có sẵn tại `http://localhost:9000`

   **Lưu ý:** Quyền cho thư mục storage được tự động thiết lập bởi script entrypoint của Docker. Không cần can thiệp thủ công.

6. Nếu không muốn dùng docker thì sau khi tạo file .env chạy lệnh
```
php artisan serve
```

### 3. Thiết Lập Database

Database được tự động tạo và migrate khi các container khởi động. Nếu cần import dữ liệu thêm:

1. Kết nối MySQL qua Workbench hoặc CLI:
   - Host: `localhost`
   - Port: `3307`
   - Username: `lqviettt`
   - Password: `secret`
   - Database: `gr2`

2. Import file SQL dump nếu cần:
   ```sql
   -- Import DB_GR2.sql vào database gr2
   ```

### 4. Thiết Lập Frontend (React App)

1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend/project-react-gr2
   ```

2. Sao chép và cấu hình file môi trường:
   ```bash
   cp .env.example .env.local
   ```

3. Cài đặt dependencies và khởi động server phát triển:
   ```bash
   npm install
   npm start
   ```


3. Frontend sẽ có sẵn tại `http://localhost:3000` (port mặc định của React)

## Lệnh Docker

- Khởi động containers: `docker-compose up -d`
- Dừng containers: `docker-compose down`
- Xem logs: `docker-compose logs -f`
- Truy cập container API: `docker exec -it api bash`

## Khắc Phục Sự Cố

- Nếu gặp lỗi quyền, đảm bảo Docker đang chạy và containers được build đúng.
- Đối với lỗi kết nối database, kiểm tra `.env` khớp với cài đặt `docker-compose.yml`.
- Xóa cache Laravel nếu cần: `docker exec -it api php artisan config:clear`

## Cấu Trúc Dự Án

```
GR2/
├── backend/
│   └── project-laravel-gr2/  # Laravel API
├── frontend/
│   └── project-react-gr2/    # React App
├── DB_GR2.sql                # Database dump
└── README.md
```
