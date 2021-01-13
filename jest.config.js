const config = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/lib/',
    '/__mocks__/',
  ],
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
};

module.exports = config;
