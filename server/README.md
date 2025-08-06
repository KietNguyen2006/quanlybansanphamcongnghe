# Backend - Hệ thống quản lý bán hàng online

## Giới thiệu
Đây là backend API cho hệ thống quản lý bán hàng online, xây dựng với Node.js, Express, Sequelize và MySQL. Backend cung cấp các chức năng quản lý sản phẩm, đơn hàng, người dùng, phân quyền, xác thực JWT, tài liệu hóa API với Swagger, gửi email tự động khi đăng ký tài khoản, và nhiều tính năng quản trị khác.

## Mô tả
Backend API cho hệ thống quản lý bán hàng online sử dụng Node.js, Express, Sequelize và MySQL.

## Cài đặt

### Yêu cầu hệ thống
- Node.js (v14 trở lên)
- MySQL (v8.0 trở lên)
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies
```bash
cd server
npm install
```

### Bước 2: Cấu hình database
1. Tạo database MySQL:
```sql
CREATE DATABASE quanlybansanpham;
```

2. Copy file env.example thành .env và cập nhật thông tin:
```bash
cp env.example .env
```

3. Cập nhật thông tin trong file .env:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quanlybansanpham
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### Bước 3: Chạy ứng dụng
```bash
# Chế độ development
npm run dev

# Chế độ production
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Đăng ký người dùng
- `POST /api/users/login` - Đăng nhập

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/search` - Tìm kiếm sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Cart
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/:productId` - Cập nhật số lượng sản phẩm
- `DELETE /api/cart/:productId` - Xóa sản phẩm khỏi giỏ hàng
- `DELETE /api/cart` - Xóa toàn bộ giỏ hàng

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/my-orders` - Lấy đơn hàng của user
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)

### Statistics (Admin)
- `GET /api/stats/orders` - Thống kê đơn hàng
- `GET /api/stats/top-products` - Sản phẩm bán chạy
- `GET /api/stats/daily` - Thống kê theo ngày
- `GET /api/stats/all-orders` - Danh sách tất cả đơn hàng

## Cấu trúc Database

### Bảng Users
- id (Primary Key)
- username
- email
- password (hashed)
- role (user/admin)

### Bảng Products
- id (Primary Key)
- name
- description
- price
- imageUrl
- category
- stock

### Bảng Orders
- id (Primary Key)
- userId (Foreign Key)
- status (pending/processing/completed)
- totalAmount

### Bảng OrderItems
- id (Primary Key)
- orderId (Foreign Key)
- productId (Foreign Key)
- quantity
- price

## Authentication

Hệ thống sử dụng JWT (JSON Web Token) để xác thực. Token được gửi trong header:
```
Authorization: Bearer <token>
```

## Phân quyền

- **User**: Có thể xem sản phẩm, thêm vào giỏ hàng, đặt hàng, xem lịch sử đơn hàng
- **Admin**: Có tất cả quyền của user + quản lý sản phẩm, đơn hàng, thống kê

## Deployment

### Render
1. Tạo tài khoản Render
2. Connect với GitHub repository
3. Cấu hình environment variables
4. Deploy

### Railway
1. Tạo tài khoản Railway
2. Connect với GitHub repository
3. Cấu hình environment variables
4. Deploy

## Tác giả
- **Backend:** Nguyễn Xuân Anh Kiệt 