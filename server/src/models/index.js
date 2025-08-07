const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Voucher = require('./Voucher');
const Cart = require('./Cart')(sequelize);
const CartItem = require('./CartItem')(sequelize);
const Category = require('./Category')(sequelize);
const Brand = require('./Brand')(sequelize);
const Review = require('./Review')(sequelize);
const Comment = require('./Comment')(sequelize);
const Notification = require('./Notification')(sequelize);
const PasswordResetToken = require('./PasswordResetToken')(sequelize);

// Thiết lập các mối quan hệ

// User có 1 Cart
User.hasOne(Cart, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Cart.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

// Cart có nhiều CartItem
Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  as: 'items',
  onDelete: 'CASCADE',
});
CartItem.belongsTo(Cart, {
  foreignKey: 'cartId',
  onDelete: 'CASCADE',
});

// CartItem liên kết với Product
CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
  onDelete: 'CASCADE',
});
Product.hasMany(CartItem, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
});

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
  const isTestEnv = process.env.NODE_ENV === 'test';
  const forceSync = isTestEnv; // Force sync in test environment
  const alter = !isTestEnv && process.env.NODE_ENV !== 'production'; // Use alter in non-test development

  console.log(`\nStarting database synchronization...`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Force sync: ${forceSync}`);
  console.log(`Alter tables: ${alter}\n`);

  try {
    // Log all models being synced in test environment
    if (isTestEnv) {
      console.log('Models to be synchronized:');
      Object.keys(sequelize.models).forEach(modelName => {
        console.log(`- ${modelName}`);
      });
      console.log('');
    }

    // Disable foreign key checks during sync
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Sync all models with force: true in test environment
    await sequelize.sync({ 
      force: forceSync,
      alter: alter,
      logging: isTestEnv ? console.log : false,
      benchmark: isTestEnv
    });

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Database synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error synchronizing database:');
    console.error(error.message);
    
    if (error.original) {
      console.error('Original error:', error.original);
    }
    
    // For test environment, fail fast
    if (isTestEnv) {
      console.error('\nTest database synchronization failed. Exiting...');
      process.exit(1);
    }
    
    return false;
  }
};

module.exports = {
  sequelize,
  Cart,
  CartItem,
  User,
  Product,
  Order,
  OrderItem,
  Voucher,
  Category,
  Brand,
  Review,
  Comment,
  Notification,
  PasswordResetToken,
  syncModels
};