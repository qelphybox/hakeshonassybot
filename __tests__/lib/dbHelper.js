const { dbClient } = require('../../src/dbClient');

const describeDBSetupTeardown = () => {
  beforeAll(async () => {
    await dbClient.connect();
  });

  afterAll(async () => {
    await dbClient.close();
  });

  beforeEach(async () => {
    await dbClient.queryMessages((messages) => messages.deleteMany({}));
  });
};

module.exports = { describeDBSetupTeardown };
