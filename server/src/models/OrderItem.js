const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID chi tiết đơn hàng'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Cho phép NULL vì có onDelete: 'SET NULL' trong mối quan hệ
    comment: 'ID sản phẩm (có thể NULL nếu sản phẩm bị xóa)'
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Tên sản phẩm tại thời điểm đặt hàng (lưu lại đề phòng sản phẩm thay đổi)'
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ảnh sản phẩm tại thời điểm đặt hàng'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Số lượng sản phẩm',
    validate: {
      min: 1,
      isInt: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Đơn giá sản phẩm tại thời điểm đặt hàng',
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.VIRTUAL,
    get() {
      return (this.getDataValue('price') * this.getDataValue('quantity')).toFixed(2);
    },
    comment: 'Thành tiền (tính toán tự động: price * quantity)'
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Giảm giá (nếu có)'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ghi chú cho sản phẩm trong đơn hàng'
  }
}, {
  timestamps: true,
  comment: 'Chi tiết các sản phẩm trong đơn hàng'
});

module.exports = OrderItem;