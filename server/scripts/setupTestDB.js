const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });
const { sequelize } = require('../src/models');

async function setupTestDatabase() {
  console.log('Setting up test database...');
  
  // Create a connection to MySQL server (without specifying a database)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('🔌 Connecting to MySQL server...');
    
    // Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    
    console.log(`Database '${process.env.DB_NAME}' created or already exists`);
    
    // Switch to the test database
    await connection.query(`USE \`${process.env.DB_NAME}\``);
    
    console.log('Successfully connected to test database');
    
    // Tạm tắt kiểm tra khóa ngoại
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Đồng bộ hóa các model
    console.log('Syncing database models...');
    
    // Bật log để xem các câu lệnh SQL
    console.log('Model names:', Object.keys(sequelize.models).join(', '));
    
    try {
      await sequelize.sync({ 
        force: true,
        logging: console.log // Bật log SQL
      });
    } catch (syncError) {
      console.error('Sync error details:', syncError);
      throw syncError;
    }
    
    // Bật lại kiểm tra khóa ngoại
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Test database synchronized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up test database:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nAccess denied. Please check your database credentials in .env.test');
      console.log('Make sure the specified user has permissions to create databases.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\nConnection refused. Please check if MySQL server is running.');
      console.log('You can start the MySQL service with: net start mysql');
    }
    
    process.exit(1);
  }
}

setupTestDatabase();
