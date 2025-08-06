const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed'),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  customerName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  customerDob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  customerAddress: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
});

module.exports = Order;