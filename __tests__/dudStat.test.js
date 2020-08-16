const dudStat = require('../src/statistics/dudStat');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const messagesDud = require('./__fixtures__/messagesDud/correctData.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};
describe('dudStat', () => {
  test('dudStat', async () => {
    await addMessages(messagesDud);
    const collection = await dudStat.collect({ chat: { id: 1 }, date: 1588982400 });
    expect(collection).toEqual(
      [{
        _id: 1,
        count: 3,
        first_name: 'test1',
        last_name: 'test1',
        username: 'test1',
      }],
    );

    const statString = dudStat.render(collection);

    expect(statString).toBe('*test1 test1* - Дудь (задал 3 вопроса)');
  });

  test('empty data', async () => {
    const collection = await dudStat.collect({ chat: { id: 1 }, date: 1588982400 });
    expect(collection).toEqual([]);

    const statString = dudStat.render(collection);

    expect(statString).toBe('');
  });
});
