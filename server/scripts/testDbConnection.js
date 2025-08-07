const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.test') });

async function testConnection() {
  console.log('Testing database connection with the following settings:');
  console.log(`- Host: ${process.env.DB_HOST}`);
  console.log(`- Port: ${process.env.DB_PORT}`);
  console.log(`- Database: ${process.env.DB_NAME}`);
  console.log(`- User: ${process.env.DB_USER}`);
  console.log(`- Password: ${process.env.DB_PASSWORD ? '*****' : 'empty'}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);

  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: console.log,
      logQueryParameters: true,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT DATABASE() as db, USER() as user, VERSION() as version');
    console.log('\nDatabase Connection Info:');
    console.log('- Current Database:', results[0].db);
    console.log('- Connected as User:', results[0].user);
    console.log('- MySQL Version:', results[0].version);
    
    // List all tables in the database
    try {
      const [tables] = await sequelize.query('SHOW TABLES');
      console.log('\nTables in database:');
      if (tables.length > 0) {
        tables.forEach(table => {
          console.log(`- ${Object.values(table)[0]}`);
        });
      } else {
        console.log('No tables found in the database.');
      }
    } catch (tableError) {
      console.warn('Could not list tables (permission issue?):', tableError.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error.original || error);
    
    // Provide specific guidance based on common errors
    if (error.original) {
      if (error.original.code === 'ER_BAD_DB_ERROR') {
        console.log('\nThe database does not exist. You may need to create it first.');
        console.log('Run the following SQL command in your MySQL console:');
        console.log(`CREATE DATABASE \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      } else if (error.original.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('\nAccess denied. Please check your database credentials in .env.test');
        console.log('Make sure the specified user has the correct permissions.');
      }
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

testConnection();
