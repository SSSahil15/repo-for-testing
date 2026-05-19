module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/db/database.js' // We might exclude the raw DB singleton if it's hard to mock, but let's test it.
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 65,
      functions: 70,
      lines: 70
    }
  },
  setupFiles: ['./src/__tests__/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js']
};
