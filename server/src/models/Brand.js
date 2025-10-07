'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Product, {
        foreignKey: 'brandId',
        as: 'products',
        onDelete: 'SET NULL',
      });
    }
  }
  Brand.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    underscored: true,
  });
  return Brand;
};