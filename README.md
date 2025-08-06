# Hệ thống quản lý bán hàng online - Backend

## Giới thiệu
Đây là backend của hệ thống quản lý bán hàng online, xây dựng với:
- **Backend:** Node.js, Express, Sequelize
- **Database:** MySQL
- **API Documentation:** Swagger UI

Dự án hỗ trợ đầy đủ các chức năng quản lý sản phẩm, đơn hàng, người dùng, phân quyền, xác thực JWT, tài liệu hóa API với Swagger, gửi email tự động khi đăng ký tài khoản, và nhiều tính năng quản trị khác.

## Mô tả
Backend hệ thống quản lý bán hàng online được xây dựng bằng Node.js + Express với MySQL làm cơ sở dữ liệu.

## Tính năng

### Chức năng người dùng (User)
- ✅ Đăng ký, đăng nhập
- ✅ Xem danh sách sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm theo danh mục, giá
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Đặt hàng (tạo đơn hàng)
- ✅ Xem lịch sử đơn hàng

### Chức năng admin
- ✅ Đăng nhập admin riêng
- ✅ CRUD sản phẩm (tên, mô tả, giá, hình ảnh)
- ✅ Quản lý đơn hàng (thay đổi trạng thái: mới → đang xử lý → đã giao)
- ✅ Thống kê đơn hàng theo ngày / tổng doanh thu

### Yêu cầu kỹ thuật
- ✅ Backend: Node.js + Express, tách rõ router/controller/model
- ✅ Database: MySQL với bảng user, product, order, order_item
- ✅ Xác thực bằng JWT
- ✅ Áp dụng phân quyền: người dùng và admin
- ✅ Sử dụng Sequelize ORM để thao tác database
- ✅ API Documentation với Swagger UI

## Cấu trúc project

```
quanlybansanphamcongnghe/
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # API controllers
│   │   ├── middlewares/    # Auth middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Utility scripts
│   │   ├── utils/          # Utility functions
│   │   ├── swagger.js      # Swagger configuration
│   │   └── index.js        # Main server file
│   ├── support/            # Support utilities
│   │   └── email.sender.js # Email sending utilities
│   ├── package.json
│   └── env.example
├── database/               # Database scripts
│   ├── init_database.sql   # Database initialization
│   ├── backup.sh          # Backup script
│   └── README.md
└── README.md
```

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (v14 trở lên)
- MySQL (v8.0 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd quanlybansanphamcongnghe
```

### Bước 2: Cài đặt backend
```bash
cd server
npm install
```

### Bước 3: Cấu hình database
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

### Bước 4: Khởi tạo database
```bash
# Chạy script khởi tạo database
mysql -u root -p quanlybansanpham < ../database/init_database.sql
```

### Bước 5: Chạy backend
```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:5000
API Documentation: http://localhost:5000/api-docs

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

## Tài khoản Admin mặc định

Sau khi khởi tạo database, tài khoản admin mặc định:
- **Username:** admin
- **Password:** admin123

## Deployment

### Backend (Render/Railway)
1. Tạo tài khoản Render hoặc Railway
2. Connect với GitHub repository
3. Cấu hình environment variables
4. Deploy

### Database (PlanetScale)
1. Tạo tài khoản PlanetScale
2. Tạo database
3. Cập nhật connection string trong backend

## Tác giả
- **Backend:** Nguyễn Xuân Anh Kiệt

## License
MIT License 