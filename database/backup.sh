#!/bin/bash

# =====================================================
# SCRIPT BACKUP DATABASE QUẢN LÝ BÁN HÀNG ONLINE
# =====================================================

# Cấu hình
DB_NAME="quanlybansanpham"
DB_USER="root"
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${DATE}.sql"

# Tạo thư mục backup nếu chưa tồn tại
mkdir -p $BACKUP_DIR

echo "====================================================="
echo "BẮT ĐẦU BACKUP DATABASE: $DB_NAME"
echo "Thời gian: $(date)"
echo "====================================================="

# Kiểm tra kết nối database
if ! mysql -u $DB_USER -p -e "USE $DB_NAME;" 2>/dev/null; then
    echo "❌ Lỗi: Không thể kết nối đến database $DB_NAME"
    echo "Vui lòng kiểm tra:"
    echo "1. MySQL service đang chạy"
    echo "2. Database $DB_NAME đã tồn tại"
    echo "3. Thông tin đăng nhập MySQL chính xác"
    exit 1
fi

echo "✅ Kết nối database thành công"

# Thực hiện backup
echo "🔄 Đang backup database..."
if mysqldump -u $DB_USER -p --single-transaction --routines --triggers $DB_NAME > $BACKUP_FILE; then
    echo "✅ Backup thành công!"
    echo "📁 File backup: $BACKUP_FILE"
    echo "📊 Kích thước file: $(du -h $BACKUP_FILE | cut -f1)"
else
    echo "❌ Lỗi: Backup thất bại"
    exit 1
fi

# Kiểm tra file backup
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    echo "✅ File backup hợp lệ"
else
    echo "❌ Lỗi: File backup không hợp lệ hoặc rỗng"
    exit 1
fi

# Hiển thị thông tin backup
echo ""
echo "====================================================="
echo "THÔNG TIN BACKUP"
echo "====================================================="
echo "Database: $DB_NAME"
echo "File backup: $BACKUP_FILE"
echo "Thời gian: $(date)"
echo "Kích thước: $(du -h $BACKUP_FILE | cut -f1)"

# Đếm số bản ghi trong database
echo ""
echo "📊 THỐNG KÊ DỮ LIỆU:"
mysql -u $DB_USER -p -e "
USE $DB_NAME;
SELECT 
    'Users' as Table_Name, COUNT(*) as Record_Count FROM Users
UNION ALL
SELECT 'Products', COUNT(*) FROM Products
UNION ALL
SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL
SELECT 'OrderItems', COUNT(*) FROM OrderItems;
" 2>/dev/null

echo ""
echo "====================================================="
echo "BACKUP HOÀN TẤT!"
echo "====================================================="

# Tùy chọn: Xóa file backup cũ (giữ lại 10 file gần nhất)
echo ""
echo "🧹 Dọn dẹp file backup cũ..."
ls -t ${BACKUP_DIR}/backup_${DB_NAME}_*.sql | tail -n +11 | xargs -r rm

echo "✅ Hoàn tất!" 