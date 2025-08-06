const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Voucher = sequelize.define('Voucher', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  minOrderValue: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = Voucher;
