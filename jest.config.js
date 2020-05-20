const config = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/lib/',
  ],
};

if (process.env.CI) {
  config.preset = '@shelf/jest-mongodb';
}

module.exports = config;
