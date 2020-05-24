const worstChatUserStat = require('../src/statistics/worstChatUserStat');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const messagesWorstChatUser = require('./__fixtures__/messagesWorstChatUser/correctData.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};
describe('worstChatUser', () => {
  test('worstChatUser', async () => {
    await addMessages(messagesWorstChatUser);
    const collection = await worstChatUserStat.collect({ chat: { id: 1 }, date: 1588982400 });
    expect(collection).toEqual(
      [{
        _id: 1,
        count: 3,
        first_name: 'test1',
        last_name: 'test1',
        username: 'test1',
      }],
    );

    const statString = worstChatUserStat.render(collection);

    expect(statString).toBe('test1 test1 - худший юзер чата');
  });

  test('empty data', async () => {
    const collection = await worstChatUserStat.collect({ chat: { id: 1 }, date: 1588982400 });
    expect(collection).toEqual([]);


    const statString = worstChatUserStat.render(collection);

    expect(statString).toBe('');
  });
});
