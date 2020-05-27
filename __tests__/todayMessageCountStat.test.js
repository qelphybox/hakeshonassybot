const todayMessageCountStat = require('../src/statistics/todayMessageCountStat');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const messagesByDay = require('./__fixtures__/messagesByDayFixtures/correctData.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};

describe('statByDay', () => {
  test('statByDay', async () => {
    await addMessages(messagesByDay);
    const collection = await todayMessageCountStat.collect({ chat: { id: 1 }, date: 1589155200 });
    expect(collection).toEqual(
      [
        {
          _id: 2,
          count: 3,
          first_name: 'test2',
          last_name: 'test2',
          username: 'test2',
        },
        {
          _id: 1,
          count: 2,
          first_name: 'test1',
          last_name: 'test1',
          username: 'test1',
        },
      ],
    );

    const statString = todayMessageCountStat.render(collection);

    expect(statString).toBe('Сообщений за последние 24 часа: test2 test2 (3), test1 test1 (2)');
  });

  test('empty data', async () => {
    const collection = await todayMessageCountStat.collect({ chat: { id: 1 }, date: 1589155200 });
    expect(collection).toEqual([]);

    const statString = todayMessageCountStat.render(collection);

    expect(statString).toBe('Сообщений за последние 24 часа: ');
  });
});
