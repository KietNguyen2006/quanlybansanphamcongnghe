'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'user_id', // Matching your database schema
        as: 'user'
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: 'OrderID', // Assuming PascalCase from your schema
        as: 'items'
      });

      // Corrected association to the updated Payment model
      Order.hasMany(models.Payment, {
        foreignKey: 'OrderID', // Matching the FK in your Payments table
        as: 'payments'
      });
    }
  }
  Order.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.STRING,
    },
    customer_name: {
      type: DataTypes.STRING,
    },
    customer_email: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders', // Sticking with snake_case as per your schema image for this table
    timestamps: true, // Let Sequelize manage created_at and updated_at
    underscored: true, // Keep this to match your column names
  });
  return Order;
};