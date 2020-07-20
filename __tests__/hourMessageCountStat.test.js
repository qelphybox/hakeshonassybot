// hours timestamp search = 1589133600

const hourMessageCountStat = require('../src/statistics/hourMessageCountStat');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const messagesByHour = require('./__fixtures__/messagesByHourFixtures/correctData.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};

describe('statByHour', () => {
  test('statByHour', async () => {
    await addMessages(messagesByHour);
    const collection = await hourMessageCountStat
      .collect({ chat: { id: 1 }, date: 1589133600 });
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

    const statString = hourMessageCountStat.render(collection);
    expect(statString).toBe('*Сообщений за последний час:* test2 test2 (3), test1 test1 (2)');
  });

  test('empty data', async () => {
    const collection = await hourMessageCountStat
      .collect({ chat: { id: 1 }, date: 1589133600 });
    expect(collection).toEqual([]);

    const statString = hourMessageCountStat.render(collection);

    expect(statString).toBe('*Сообщений за последний час:* ');
  });
});
