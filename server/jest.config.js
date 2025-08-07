module.exports = {
  // Run setup before each test file
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  
  // Test environment
  testEnvironment: 'node',
  
  // Test timeout (30 seconds)
  testTimeout: 30000,
  
  // Collect test coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js',
    '!src/app.js',
    '!src/config/*.js',
  ],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
  ],
  
  // Transform settings
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  
  // Module name mapper (if you're using path aliases)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
