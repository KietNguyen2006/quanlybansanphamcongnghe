process.env.NODE_ENV = 'test';

const { sequelize, syncModels } = require('./src/models');

const runTest = async () => {
  console.log('Attempting to connect and sync database...');
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await syncModels();
    console.log('All models were synchronized successfully.');

    await sequelize.close();
    process.exit(0); // Success
  } catch (error) {
    console.error('\n--- FAILED TO SYNC DATABASE ---');
    console.error('This is the detailed error from Sequelize:');
    
    // Print the most important parts of the error
    console.error('Error Message:', error.message);
    if (error.original) {
      console.error('Original SQL Error:', error.original.sqlMessage);
      console.error('SQLSTATE:', error.original.sqlState);
      console.error('SQL:', error.original.sql);
    }
    console.error('\n--- RAW ERROR OBJECT ---');
    console.error(error);
    console.error('\n--------------------------\n');

    await sequelize.close();
    process.exit(1); // Failure
  }
};

runTest();
