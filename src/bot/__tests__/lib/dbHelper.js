const { dbClient } = require('../../../dbClient');
const { dbClient: dbClientPg } = require('../../../db/dbClientPg');

const describeDBSetupTeardown = () => {
  beforeAll(async () => {
    await dbClient.connect();
    await dbClientPg.connect();
  });

  afterAll(async () => {
    await dbClient.close();
    await dbClientPg.close();
  });

  beforeEach(async () => {
    await dbClient.queryMessages((messages) => messages.deleteMany({}));
  });
};

module.exports = { describeDBSetupTeardown };
