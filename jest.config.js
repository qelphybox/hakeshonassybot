const config = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/lib/',
    '/__mocks__/',
  ],
};

if (process.env.CI) {
  config.preset = '@shelf/jest-mongodb';
}

module.exports = config;
