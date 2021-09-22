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
    await dbClientPg.client.query('TRUNCATE message_metrics CASCADE');
    await dbClientPg.client.query('TRUNCATE chats CASCADE');
    await dbClientPg.client.query('TRUNCATE users CASCADE');
    await dbClientPg.client.query('TRUNCATE users_chats CASCADE');
    await dbClient.queryMessages((messages) => messages.deleteMany({}));
  });
};

module.exports = { describeDBSetupTeardown };
