# Database - Hệ thống quản lý bán hàng online

## Mô tả
Thư mục này chứa các file SQL để khởi tạo và cấu hình database MySQL cho hệ thống quản lý bán hàng online.

## Cấu trúc file

```
database/
├── schema.sql          # Cấu trúc database (tables, indexes)
├── sample_data.sql     # Dữ liệu mẫu
├── init_database.sql   # File tổng hợp để khởi tạo toàn bộ database
└── README.md          # Hướng dẫn này
```

## Cách sử dụng

### Phương pháp 1: Sử dụng file init_database.sql (Khuyến nghị)
```bash
# Kết nối MySQL và chạy file
mysql -u root -p < database/init_database.sql
```

### Phương pháp 2: Chạy từng file riêng biệt
```bash
# 1. Tạo cấu trúc database
mysql -u root -p < database/schema.sql

# 2. Thêm dữ liệu mẫu
mysql -u root -p < database/sample_data.sql
```

### Phương pháp 3: Sử dụng MySQL Workbench hoặc phpMyAdmin
1. Mở MySQL Workbench hoặc phpMyAdmin
2. Tạo database mới tên `quanlybansanpham`
3. Copy và paste nội dung từ file `init_database.sql`
4. Chạy script

## Cấu trúc Database

### Bảng Users
- **id**: Khóa chính, tự động tăng
- **username**: Tên người dùng (unique)
- **email**: Email (unique)
- **password**: Mật khẩu đã hash bằng bcrypt
- **role**: Vai trò (user/admin)
- **createdAt/updatedAt**: Timestamp

### Bảng Products
- **id**: Khóa chính, tự động tăng
- **name**: Tên sản phẩm
- **description**: Mô tả sản phẩm
- **price**: Giá sản phẩm (DECIMAL)
- **imageUrl**: URL hình ảnh
- **category**: Danh mục sản phẩm
- **stock**: Số lượng tồn kho
- **createdAt/updatedAt**: Timestamp

### Bảng Orders
- **id**: Khóa chính, tự động tăng
- **userId**: Khóa ngoại đến Users
- **status**: Trạng thái đơn hàng (pending/processing/completed)
- **totalAmount**: Tổng tiền đơn hàng
- **createdAt/updatedAt**: Timestamp

### Bảng OrderItems
- **id**: Khóa chính, tự động tăng
- **orderId**: Khóa ngoại đến Orders
- **productId**: Khóa ngoại đến Products
- **quantity**: Số lượng sản phẩm
- **price**: Giá sản phẩm tại thời điểm đặt hàng
- **createdAt/updatedAt**: Timestamp

## Dữ liệu mẫu

### Tài khoản mẫu
| Email | Password | Role |
|-------|----------|------|
| admin@techstore.com | password123 | admin |
| user1@example.com | password123 | user |
| user2@example.com | password123 | user |
| nguyenvanA@gmail.com | password123 | user |
| tranthiB@gmail.com | password123 | user |

### Sản phẩm mẫu
- **Laptop**: 4 sản phẩm (Dell, HP, ASUS, MacBook)
- **Điện thoại**: 4 sản phẩm (iPhone, Samsung, Xiaomi, OPPO)
- **Máy tính bảng**: 3 sản phẩm (iPad, Samsung, Xiaomi)
- **Phụ kiện**: 5 sản phẩm (Tai nghe, Chuột, Bàn phím, Ổ cứng, Webcam)

### Đơn hàng mẫu
- 5 đơn hàng với các trạng thái khác nhau
- Dữ liệu OrderItems tương ứng

## Indexes được tạo
- `idx_users_email`: Tối ưu tìm kiếm user theo email
- `idx_products_category`: Tối ưu lọc sản phẩm theo danh mục
- `idx_products_price`: Tối ưu lọc sản phẩm theo giá
- `idx_orders_userId`: Tối ưu tìm đơn hàng theo user
- `idx_orders_status`: Tối ưu lọc đơn hàng theo trạng thái
- `idx_orderitems_orderId`: Tối ưu tìm chi tiết đơn hàng
- `idx_orderitems_productId`: Tối ưu tìm đơn hàng theo sản phẩm

## Lưu ý quan trọng

1. **Character Set**: Database sử dụng `utf8mb4` để hỗ trợ đầy đủ tiếng Việt
2. **Foreign Keys**: Có CASCADE DELETE để đảm bảo tính toàn vẹn dữ liệu
3. **Timestamps**: Tự động cập nhật thời gian tạo và sửa
4. **Password Hash**: Mật khẩu được hash bằng bcrypt với salt rounds = 10
5. **Decimal**: Giá tiền sử dụng DECIMAL(10,2) để tránh lỗi làm tròn

## Backup và Restore

### Backup database
```bash
mysqldump -u root -p quanlybansanpham > backup_quanlybansanpham.sql
```

### Restore database
```bash
mysql -u root -p quanlybansanpham < backup_quanlybansanpham.sql
```

## Troubleshooting

### Lỗi thường gặp
1. **Access denied**: Kiểm tra quyền truy cập MySQL
2. **Database exists**: Xóa database cũ trước khi tạo mới
3. **Character set**: Đảm bảo MySQL hỗ trợ utf8mb4
4. **Foreign key constraint**: Kiểm tra thứ tự tạo bảng

### Kiểm tra database
```sql
-- Kiểm tra database đã tạo
SHOW DATABASES;

-- Kiểm tra bảng
USE quanlybansanpham;
SHOW TABLES;

-- Kiểm tra dữ liệu
SELECT COUNT(*) FROM Users;
SELECT COUNT(*) FROM Products;
SELECT COUNT(*) FROM Orders;
SELECT COUNT(*) FROM OrderItems;
``` 