const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.test' });

async function checkDatabase() {
  console.log('Checking test database configuration...');
  console.log('Environment Variables:');
  console.log(`- DB_HOST: ${process.env.DB_HOST}`);
  console.log(`- DB_PORT: ${process.env.DB_PORT}`);
  console.log(`- DB_USER: ${process.env.DB_USER}`);
  console.log(`- DB_PASSWORD: ${process.env.DB_PASSWORD ? '*****' : '(empty)'}`);
  console.log(`- DB_NAME: ${process.env.DB_NAME}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);

  // Create a connection to MySQL server (without specifying a database)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('\nChecking if MySQL server is accessible...');
    await connection.ping();
    console.log('Successfully connected to MySQL server');

    // Check if the database exists
    const [dbs] = await connection.query('SHOW DATABASES');
    const dbNames = dbs.map(db => db.Database);
    console.log('\nAvailable databases:', dbNames);

    const dbExists = dbNames.includes(process.env.DB_NAME);
    if (dbExists) {
      console.log(`Database '${process.env.DB_NAME}' exists`);
      
      // Check tables in the database
      await connection.changeUser({ database: process.env.DB_NAME });
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`\nTables in '${process.env.DB_NAME}':`);
      if (tables.length > 0) {
        tables.forEach(table => {
          console.log(`- ${Object.values(table)[0]}`);
        });
      } else {
        console.log('No tables found in the database.');
      }
    } else {
      console.log(`Database '${process.env.DB_NAME}' does not exist`);
      console.log('\nYou can create it with:');
      console.log(`CREATE DATABASE \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      console.log(`GRANT ALL PRIVILEGES ON \`${process.env.DB_NAME}\`.* TO '${process.env.DB_USER}'@'localhost';`);
      console.log('FLUSH PRIVILEGES;');
    }
  } catch (error) {
    console.error('\nError:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nAccess denied. Please check your database credentials in .env.test');
      console.log('Make sure the specified user has the correct permissions.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\nConnection refused. Please check if MySQL server is running.');
      console.log('You can start the MySQL service with: net start mysql');
    }
  } finally {
    await connection.end();
  }
}

checkDatabase();
