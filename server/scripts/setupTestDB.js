const mysql = require('mysql2/promise');
const path = require('path');

// Use the same config file as the application
const config = require(path.join(__dirname, '..', 'src', 'config', 'config.json')).test;

const TEST_DB_NAME = config.database;

async function setupTestDatabase() {
  console.log(`Verifying connection to test database '${TEST_DB_NAME}'...'`);

  let connection;
  try {
    // Connect directly to the test database to verify it exists and is accessible
    connection = await mysql.createConnection({
      host: config.host,
      port: config.port || 3306,
      user: config.username,
      password: config.password,
      database: TEST_DB_NAME, // Specify the test database directly
    });

    console.log(`Successfully connected to test database '${TEST_DB_NAME}'.`);

  } catch (error) {
    console.error('Fatal error connecting to test database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`\nAccess denied. Please ensure the user '${config.username}' has ALL PRIVILEGES on the '${TEST_DB_NAME}' database.`);
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`\nDatabase '${TEST_DB_NAME}' does not exist. Please create it via your hosting control panel and assign the user '${config.username}' to it.`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection refused. Please check if the MySQL server is running and accessible.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupTestDatabase();
