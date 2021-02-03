const config = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/lib/',
    '/__mocks__/',
    '/utils/',
  ],
  setupFiles: [
    './.jest/dotenv-test.js',
  ],
};

module.exports = config;
