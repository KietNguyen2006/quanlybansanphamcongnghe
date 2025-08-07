const { sequelize, syncModels } = require('../models');

// Global setup for tests
module.exports = async () => {
  console.log('\nSetting up test environment...');
  
  try {
    // Force sync all models before running tests
    await syncModels();
    
    // Additional test setup can go here
    console.log('Test environment setup complete\n');
  } catch (error) {
    console.error('Test setup failed:', error);
    process.exit(1);
  }
};
