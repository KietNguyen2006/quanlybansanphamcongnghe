const { sequelize } = require('../models');

describe('Simple Database Test', () => {
  beforeAll(async () => {
    console.log('\n Setting up test...');
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully');
      
      // Test a simple query
      const [results] = await sequelize.query('SELECT 1+1 as result');
      console.log('Simple query result:', results[0].result);
      
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error; // Fail the test
    }
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
      console.log('Database connection closed');
    }
  });

  it('should pass a simple test', () => {
    expect(true).toBe(true);
  });
});
