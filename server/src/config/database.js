const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTestEnvironment = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: isTestEnvironment ? console.log : false, // Enable logging for test environment
    logQueryParameters: isTestEnvironment, // Log query parameters for test environment
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      decimalNumbers: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
      // For test environment, allow multiple statements (useful for test setup)
      ...(isTestEnvironment && { multipleStatements: true })
    }
  }
);

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Log database info in test environment
    if (isTestEnvironment) {
      const [results] = await sequelize.query('SELECT DATABASE() as db, USER() as user, VERSION() as version');
      console.log('Database Info:', {
        database: results[0].db,
        user: results[0].user,
        version: results[0].version
      });
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Exit with error code if we can't connect to the database
    process.exit(1);
  }
};

// Only run connection test if not in test environment (Jest will handle its own setup)
if (!isTestEnvironment) {
  testConnection();
}

module.exports = sequelize;