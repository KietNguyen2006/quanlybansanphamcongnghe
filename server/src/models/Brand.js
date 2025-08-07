const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Brand = sequelize.define('Brand', {
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
    tableName: 'Brand',  // Explicitly set table name to singular
    timestamps: true,    // Enable timestamps (createdAt, updatedAt)
    underscored: true    // Use snake_case for column names
  });
  return Brand;
};
