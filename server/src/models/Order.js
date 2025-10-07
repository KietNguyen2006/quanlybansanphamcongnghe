'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'SET NULL'
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items',
        onDelete: 'CASCADE',
      });

      Order.hasMany(models.Payment, {
        foreignKey: 'orderId',
        as: 'payments',
        onDelete: 'CASCADE',
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.STRING,
    },
    customerName: {
      type: DataTypes.STRING,
    },
    customerEmail: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
  });
  return Order;
};