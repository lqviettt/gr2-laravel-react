# GR2 — Ứng Dụng Thương Mại Điện Tử (Laravel + React)

Ứng dụng thương mại điện tử full-stack phục vụ đồ án tốt nghiệp. Backend là **Laravel 10 REST API**, frontend là **React 18 SPA**, toàn bộ được container hóa bằng **Docker**.

---

## Mục Lục

- [Công nghệ](#công-nghệ)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Cài đặt Database](#cài-đặt-database)
- [Ảnh sản phẩm](#ảnh-sản-phẩm)
- [Cổng dịch vụ](#cổng-dịch-vụ)
- [Các lệnh thường dùng](#các-lệnh-thường-dùng)
- [Phát triển local (không dùng Docker)](#phát-triển-local-không-dùng-docker)
- [Khắc phục sự cố](#khắc-phục-sự-cố)

---

## Công Nghệ

| Tầng | Công nghệ |
|------|-----------|
| Backend | PHP 8.2, Laravel 10, JWT Auth |
| Frontend | React 18, Tailwind CSS, Bootstrap 5, Axios |
| Database | MySQL 8.0 |
| Cache / Queue | Redis |
| Web Server | Nginx + PHP-FPM |
| Container | Docker, Docker Compose |
| Shipping | GHN API, GHTK API |
| Thanh toán | VNPay |

---

## Yêu Cầu Hệ Thống

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Docker Desktop | 24.x+ |
| Docker Compose | v2.x+ (đi kèm Docker Desktop) |
| Git | bất kỳ |

> **Không cần** cài PHP, Composer, Node.js trên máy nếu chỉ chạy qua Docker.

---

## Cấu Trúc Dự Án

```
gr2-laravel-react/
├── docker-compose.yml            # Khởi động toàn bộ stack
│
├── backend/                      # Laravel 10 REST API
│   ├── Dockerfile
│   ├── .env                      # Cấu hình môi trường (tạo từ .env.example)
│   ├── docker/
│   │   ├── entrypoint.sh         # Script khởi động container
│   │   ├── nginx/nginx.conf      # Nginx cho backend
│   │   ├── php/php.ini
│   │   └── mysql/conf.d/my.cnf
│   ├── app/                      # Controllers, Models, Services...
│   ├── Modules/                  # Kiến trúc modular (nwidart)
│   │   ├── Employee/             # Quản lý nhân viên, phân quyền
│   │   ├── Order/                # Đơn hàng, lịch sử
│   │   ├── Payment/              # Thanh toán (VNPay)
│   │   ├── Product/              # Sản phẩm, danh mục, biến thể, review
│   │   └── Shipping/             # Vận chuyển (GHN, GHTK), địa chỉ
│   ├── database/
│   │   ├── migrations/           # Tất cả migration
│   │   └── seeders/              # Dữ liệu mẫu
│   └── routes/api.php
│
├── frontend/                     # React 18 SPA
│   ├── Dockerfile
│   ├── docker/nginx/nginx.conf   # Nginx cho SPA routing
│   ├── src/
│   │   ├── pages/
│   │   │   ├── user/             # Trang khách hàng
│   │   │   └── admin/            # Trang quản trị
│   │   ├── components/           # UI components
│   │   ├── hooks/                # Custom React hooks
│   │   └── utils/                # Tiện ích
│   └── package.json
│
├── Image/                        # Ảnh sản phẩm, banner (được mount vào container)
│   └── public/
│       ├── products/
│       ├── banners/
│       └── variants/
│
└── oke.sql                       # Dump database với dữ liệu mẫu
```

---

## Cài Đặt & Chạy

### Bước 1 — Clone repository

```bash
git clone https://github.com/lqviettt/gr2-laravel-react.git
cd gr2-laravel-react
```

### Bước 2 — Tạo file .env cho backend

```bash
cp backend/.env.example backend/.env
```

> File `.env.example` đã có sẵn cấu hình database và Redis khớp với `docker-compose.yml`. Chỉ cần điền thêm API key của bên thứ ba nếu muốn dùng tính năng vận chuyển và thanh toán (xem [Cấu hình môi trường](#cấu-hình-môi-trường)).

### Bước 3 — Build và khởi động

```bash
docker compose up -d --build
```

Lần đầu chạy Docker sẽ tự động:
- Pull image MySQL, Redis, phpMyAdmin
- Build image PHP + Nginx cho backend
- Build React app và serve qua Nginx cho frontend
- Chạy `composer install` bên trong container
- Tạo `APP_KEY` và `JWT_SECRET`
- Chạy toàn bộ migration tạo database schema
- Tạo symlink `storage:link`

> Lần đầu build mất khoảng **3–5 phút**. Theo dõi tiến trình:
> ```bash
> docker compose logs -f api
> ```

### Bước 4 — Kiểm tra

Mở trình duyệt:
- Frontend: http://localhost:3000
- Backend API: http://localhost:9000/api
- phpMyAdmin: http://localhost:91

---

## Cấu Hình Môi Trường

File `backend/.env` — các giá trị quan trọng:

### Database & Cache (đã cấu hình sẵn)

```env
DB_CONNECTION=mysql
DB_HOST=database       # tên service trong docker-compose
DB_PORT=3306
DB_DATABASE=gr2
DB_USERNAME=lqviettt
DB_PASSWORD=secret

REDIS_HOST=redis       # tên service trong docker-compose
REDIS_PASSWORD=secret
REDIS_PORT=6379
```

> **Lưu ý:** Nếu chạy Laravel **ngoài Docker** (local), đổi `DB_HOST=127.0.0.1` và `REDIS_HOST=127.0.0.1`.

### API Vận Chuyển (tùy chọn)

```env
# GHN (Giao Hàng Nhanh)
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api
GHN_API_TOKEN=<token từ dashboard GHN>
GHN_SHOP_ID=<shop id GHN>

# GHTK (Giao Hàng Tiết Kiệm)
GHTK_API_URL=https://services.giaohangtietkiem.vn
GHTK_API_TOKEN=<token từ dashboard GHTK>
```

### Thanh Toán VNPay (tùy chọn)

```env
VNPAY_TMN_CODE=<mã website trên VNPay sandbox>
VNPAY_HASH_KEY=<secret key từ VNPay>
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:9000/api/payment/vnpay/callback
```

---

## Cài Đặt Database

### Cách 1 — Migration tự động (cấu trúc rỗng)

Entrypoint đã chạy `php artisan migrate` khi container khởi động. Database `gr2` sẽ có đủ 23 bảng nhưng **không có dữ liệu**.

Các bảng được tạo:

| Nhóm | Bảng |
|------|------|
| Người dùng | `users`, `password_reset_tokens`, `personal_access_tokens` |
| Sản phẩm | `products`, `categories`, `product_variants`, `variant_options` |
| Đánh giá | `product_reviews`, `product_comments`, `comment_likes`, `reviews` |
| Đơn hàng | `orders`, `order_items`, `order_histories` |
| Thanh toán | `payments` |
| Vận chuyển | `locations` |
| Nhân viên | `employees`, `permissions`, `employee_permissions` |
| Hệ thống | `jobs`, `failed_jobs`, `migrations` |

### Cách 2 — Import `oke.sql` (có dữ liệu mẫu) ← Khuyến nghị

File `oke.sql` (1.8MB) chứa toàn bộ schema + dữ liệu mẫu (sản phẩm, danh mục, đơn hàng...).

> **Lưu ý trước khi import:** MySQL Docker image tạo user `lqviettt` với host `%` (TCP), không phải `localhost` (Unix socket). Lệnh `mysql -u lqviettt` bên trong container sẽ báo **"Access denied"** vì mặc định dùng socket. Phải dùng `-h 127.0.0.1` hoặc dùng `root` như hướng dẫn dưới.

**Import qua Docker (cách khuyến nghị):**

```bash
# Bước 1 — Chờ MySQL sẵn sàng (sau khi docker compose up khoảng 30-60 giây)
docker exec database mysqladmin -u root -psecret ping --wait 2>/dev/null

# Bước 2 — Import bằng root (tránh lỗi Access denied)
docker exec -i database mysql -h 127.0.0.1 -u root -psecret gr2 < oke.sql
```

Nếu vẫn lỗi "database not found", tạo database trước rồi import:

```bash
docker exec -i database mysql -h 127.0.0.1 -u root -psecret -e "CREATE DATABASE IF NOT EXISTS gr2;"
docker exec -i database mysql -h 127.0.0.1 -u root -psecret gr2 < oke.sql
```

**Import qua phpMyAdmin (dễ nhất, không cần terminal):**

1. Mở http://localhost:91
2. Đăng nhập: username `root`, password `secret`
3. Chọn database `gr2` ở cột trái → tab **Import**
4. Chọn file `oke.sql` → **Execute**

**Import qua MySQL Workbench / DBeaver:**

```
Host:     127.0.0.1
Port:     3307          ← chú ý port 3307, không phải 3306
Username: root
Password: secret
Database: gr2
```

> Dùng `root` thay vì `lqviettt` khi kết nối từ ngoài container để tránh lỗi Access denied.

### Tạo tài khoản admin ban đầu

Nếu dùng migration (Cách 1) hoặc `oke.sql` chưa có user, chạy seeder:

```bash
docker exec -it api php artisan db:seed --class=UserSeeder
```

Tài khoản được tạo:
- Email: `quocviettt45@gmail.com`
- Password: `123456`

> Nếu `oke.sql` đã có dữ liệu user thì bỏ qua bước này.

---

## Ảnh Sản Phẩm

Thư mục `Image/public/` chứa ảnh thực của sản phẩm, banner và biến thể. Thư mục này được mount thẳng vào `storage/app/public` bên trong container:

```
./Image/public  →  /var/www/storage/app/public
```

Laravel serve ảnh qua symlink `public/storage → storage/app/public` (được tạo tự động bởi `php artisan storage:link` trong entrypoint). Kết quả ảnh truy cập được tại:

```
http://localhost:9000/storage/products/<tên file>
http://localhost:9000/storage/banners/<tên file>
http://localhost:9000/storage/variants/<tên file>
```

Không cần copy thủ công. Ảnh upload mới cũng sẽ được lưu vào `Image/public/` trên host.

---

## Cổng Dịch Vụ

| Dịch vụ | URL / Host | Ghi chú |
|---------|-----------|---------|
| **Frontend** | http://localhost:3000 | React SPA |
| **Backend API** | http://localhost:9000 | Base: `/api` |
| **phpMyAdmin** | http://localhost:91 | Quản lý DB trực quan |
| **MySQL** | localhost:**3307** | Dùng khi kết nối bằng client ngoài |
| **Redis** | localhost:6380 | Password: `secret` |

---

## Các Lệnh Thường Dùng

```bash
# Khởi động (chạy ngầm)
docker compose up -d

# Build lại và khởi động (sau khi thay đổi Dockerfile hoặc composer.json)
docker compose up -d --build

# Dừng tất cả container
docker compose down

# Xem log realtime của backend
docker compose logs -f api

# Vào terminal của container backend
docker exec -it api bash

# Chạy migration
docker exec -it api php artisan migrate

# Rollback migration
docker exec -it api php artisan migrate:rollback

# Xem trạng thái migration
docker exec -it api php artisan migrate:status

# Chạy seeder
docker exec -it api php artisan db:seed

# Xóa toàn bộ cache
docker exec -it api php artisan optimize:clear

# Xem routes
docker exec -it api php artisan route:list
```

---

## Phát Triển Local (Không Dùng Docker)

Nếu muốn chạy trực tiếp trên máy (cần cài PHP 8.2, Composer, Node.js, MySQL, Redis):

### Backend

```bash
cd backend

# Cài dependencies
composer install

# Tạo .env và đổi host về localhost
cp .env.example .env
# Sửa: DB_HOST=127.0.0.1, REDIS_HOST=127.0.0.1

# Tạo key và chạy migration
php artisan key:generate
php artisan migrate
php artisan jwt:secret
php artisan storage:link

# Khởi động server
php artisan serve --port=9000
```

### Frontend

```bash
cd frontend

npm install
npm start        # Dev server tại http://localhost:3000
```

---

## Khắc Phục Sự Cố

### Container `api` bị lỗi khi khởi động

```bash
# Xem log chi tiết
docker compose logs api

# Vào container kiểm tra
docker exec -it api bash
```

### Lỗi kết nối database

```bash
# Kiểm tra container database đang chạy
docker compose ps

# Thử kết nối thủ công
docker exec -it database mysql -u lqviettt -psecret -e "SHOW DATABASES;"
```

### Frontend không gọi được API

Kiểm tra file `frontend/.env.local`:
```env
REACT_APP_API_URL=http://127.0.0.1:9000/api
REACT_APP_LARAVEL_APP=http://127.0.0.1:9000
```

Nếu build lại frontend với URL khác:
```bash
docker compose up -d --build frontend
```

### Xóa toàn bộ và làm lại từ đầu

```bash
# Xóa container, network, volume (mất dữ liệu database!)
docker compose down -v

# Build lại hoàn toàn
docker compose up -d --build
```

### Lỗi quyền storage

```bash
docker exec -it api bash -c "chmod -R 775 storage bootstrap/cache && chown -R www-data:www-data storage bootstrap/cache"
```
