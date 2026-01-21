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
   - Database: 
   `DB_CONNECTION=mysql`
   `DB_HOST=database`
   `DB_PORT=3306`
   `DB_DATABASE=gr2`
   `DB_USERNAME=lqviettt`
   `DB_PASSWORD=secret`

   - Cài đặt mail, thông tin VNPay, v.v. nếu cần

3. Khởi động các container Docker:
   ```bash
   docker-compose up -d --build
   ```

4. Sửa lỗi tương thích trong package modules:

   - Truy cập vào bên trong container api bằng lệnh `docker exec -it api bash`
   - Cài nano nều chưa có `apt-get install -y nano`
   - Sau đó mở file bằng lệnh `nano vendor/nwidart/laravel-modules/src/Commands/BaseCommand.php`
   - Comment hoặc xóa dòng: `use Prohibitable;`
   - Sau đó Ctrl + X để lưu lại

5. Sau đó tắt container và chạy lại bằng 2 lệnh lần lượt:
```bash
docker compose down
docker compose up -d
```

6. Thành công sẽ truy cập được ở `localhost:9000`

**Lưu ý:** Quyền cho thư mục storage được tự động thiết lập bởi script entrypoint của Docker. Không cần can thiệp thủ công.


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
   -- Import oke.sql vào database gr2
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

4. Frontend sẽ có sẵn tại `http://localhost:3000` (port mặc định của React)

## Lấy file ảnh sản phẩm
- Coppy thư mục Image/public vào storage/app (public là con của app)
- Nếu không làm bước này thì sẽ không hiện được ảnh sản phẩm

## Các Lệnh Docker cần dùng

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
