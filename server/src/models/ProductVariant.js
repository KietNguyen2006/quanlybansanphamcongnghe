'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
      ProductVariant.hasMany(models.OrderItem, {
        foreignKey: 'productVariantId',
        onDelete: 'CASCADE',
      });
    }
  }
  ProductVariant.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'ProductVariant',
    tableName: 'product_variants',
    underscored: true,
  });
  return ProductVariant;
};