'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.ProductVariant, {
        foreignKey: 'productId',
        as: 'variants',
        onDelete: 'CASCADE',
      });
      Product.hasMany(models.Specification, {
        foreignKey: 'productId',
        as: 'specifications',
        onDelete: 'CASCADE',
      });
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        onDelete: 'SET NULL',
      });
      Product.belongsTo(models.Brand, {
        foreignKey: 'brandId',
        as: 'brand',
        onDelete: 'SET NULL',
      });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
  });
  return Product;
};