'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Specification extends Model {
    static associate(models) {
      Specification.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
    }
  }
  Specification.init({
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
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Specification',
    tableName: 'specifications',
    underscored: true,
  });
  return Specification;
};