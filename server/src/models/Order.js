const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'pending',
    comment: 'Trạng thái đơn hàng: pending - chờ xử lý, processing - đang xử lý, completed - hoàn thành, cancelled - đã hủy'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Tổng tiền đơn hàng'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cod', 'momo', 'banking'),
    defaultValue: 'cod',
    comment: 'Phương thức thanh toán: cod - thanh toán khi nhận hàng, momo - thanh toán qua ví MoMo, banking - chuyển khoản ngân hàng'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Địa chỉ giao hàng chi tiết'
  },
  customerName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Tên khách hàng (cho đơn hàng không cần đăng nhập)'
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Số điện thoại khách hàng (cho đơn hàng không cần đăng nhập)'
  },
  customerEmail: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Email khách hàng (cho đơn hàng không cần đăng nhập)',
    validate: {
      isEmail: true
    }
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ghi chú đơn hàng'
  }
});

module.exports = Order;