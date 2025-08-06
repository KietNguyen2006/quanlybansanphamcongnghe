const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Voucher = require('./Voucher');
const sequelize = require('../config/database');

// Thiết lập các mối quan hệ

// User có nhiều Order
User.hasMany(Order, {
  foreignKey: 'userId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'SET NULL'
});

// Order có nhiều OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE'
});

// Product có nhiều OrderItem
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
  onDelete: 'CASCADE'
});

// Voucher có thể được sử dụng trong nhiều Order (tùy chọn)
Voucher.hasMany(Order, {
  foreignKey: 'voucherId',
  onDelete: 'SET NULL'
});
Order.belongsTo(Voucher, {
  foreignKey: 'voucherId',
  as: 'voucher',
  onDelete: 'SET NULL'
});

// Đồng bộ hóa các model với database
const syncModels = async () => {
  try {
    // Sử dụng alter: true để cập nhật schema mà không xóa dữ liệu
    // Trong môi trường production nên sử dụng migrations thay vì sync
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Voucher,
  syncModels
};