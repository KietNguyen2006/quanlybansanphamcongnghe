const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Mỗi user chỉ có 1 cart
    },
  }, {
    tableName: 'carts',
    timestamps: true,
  });

  return Cart;
};
