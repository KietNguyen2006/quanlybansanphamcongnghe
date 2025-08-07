const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

async function checkConnection() {
  console.log('Checking MySQL connection...');
  
  // Connection configuration
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectTimeout: 5000 // 5 seconds timeout
  };

  console.log('\nConnection Configuration:');
  console.log(`- Host: ${config.host}`);
  console.log(`- Port: ${config.port}`);
  console.log(`- User: ${config.user}`);
  console.log(`- Password: ${config.password ? '*****' : '(empty)'}`);
  console.log(`- Database: ${process.env.DB_NAME || '(not specified)'}`);
  console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);

  let connection;
  try {
    // Test connection to MySQL server
    console.log('\nAttempting to connect to MySQL server...');
    connection = await mysql.createConnection(config);
    
    // Get MySQL version
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log(`Successfully connected to MySQL server!`);
    console.log(`   MySQL Version: ${rows[0].version}`);
    
    // Check if database exists
    if (process.env.DB_NAME) {
      console.log(`\nChecking if database '${process.env.DB_NAME}' exists...`);
      const [dbs] = await connection.query('SHOW DATABASES');
      const dbExists = dbs.some(db => db.Database === process.env.DB_NAME);
      
      if (dbExists) {
        console.log(`Database '${process.env.DB_NAME}' exists`);
        
        // List tables in the database
        await connection.changeUser({ database: process.env.DB_NAME });
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`\nTables in '${process.env.DB_NAME}':`);
        if (tables.length > 0) {
          tables.forEach(table => {
            console.log(`- ${Object.values(table)[0]}`);
          });
        } else {
          console.log('No tables found.');
        }
      } else {
        console.log(`Database '${process.env.DB_NAME}' does not exist`);
        console.log('\nYou can create it with:');
        console.log(`1. Open MySQL command line client`);
        console.log(`2. Run: CREATE DATABASE \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`3. Run: GRANT ALL PRIVILEGES ON \`${process.env.DB_NAME}\`.* TO '${config.user}'@'localhost';`);
        console.log('4. Run: FLUSH PRIVILEGES;');
      }
    }
  } catch (error) {
    console.error('\nConnection failed!');
    console.error(`Error: ${error.message}`);
    
    // Provide specific troubleshooting tips based on error
    if (error.code === 'ECONNREFUSED') {
      console.log('\nTroubleshooting:');
      console.log('1. Make sure MySQL server is running');
      console.log('   - For Windows: Open Services (services.msc) and check if "MySQL" service is running');
      console.log('   - Or run: net start mysql');
      console.log('2. Verify the connection details in .env.test are correct');
      console.log('3. Check if MySQL is configured to accept connections (not running in --skip-networking mode)');
      console.log('4. If using a non-standard port, verify the port number is correct');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nTroubleshooting:');
      console.log('1. Verify the username and password in .env.test are correct');
      console.log('2. Check if the user has permission to connect from your IP address');
      console.log('3. Try connecting with root user (if available) to verify credentials');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\nTroubleshooting:');
      console.log('1. The specified database does not exist');
      console.log('2. Create the database or check for typos in the database name');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nConnection closed');
    }
  }
}

// Run the check
checkConnection();
