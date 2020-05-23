// hours timestamp search = 1589133600

const todayMessageCountStat = require('../src/statistics/todayMessageCountStat');
const hourMessageCountStat = require('../src/statistics/hourMessageCountStat');
const worklessUserStat = require('../src/statistics/worklessUserStat');
const contentSupplierStat = require('../src/statistics/contentSupplierStat');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const messagesByHour = require('./__fixtures__/messagesByHourFixtures/correctData.json');
const messagesByDay = require('./__fixtures__/messagesByDayFixtures/correctData.json');
const messagesWorklessUser = require('./__fixtures__/messagesWorklessUser/correctData.json');

describeDBSetupTeardown();

describe('stats', () => {
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
      expect(statString).toBe('Сообщений за последний час: [test2 test2](tg://user?id=2) (3), [test1 test1](tg://user?id=1) (2)');
    });

    test('empty data', async () => {
      const collection = await hourMessageCountStat
        .collect({ chat: { id: 1 }, date: 1589133600 });
      expect(collection).toEqual([]);

      const statString = hourMessageCountStat.render(collection);

      expect(statString).toBe('Сообщений за последний час: ');
    });
  });

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

      expect(statString).toBe('Сообщений за последние 24 часа: [test2 test2](tg://user?id=2) (3), [test1 test1](tg://user?id=1) (2)');
    });

    test('empty data', async () => {
      const collection = await todayMessageCountStat.collect({ chat: { id: 1 }, date: 1589155200 });
      expect(collection).toEqual([]);

      const statString = todayMessageCountStat.render(collection);

      expect(statString).toBe('Сообщений за последние 24 часа: ');
    });
  });

  describe('worklessUser', () => {
    test('worklessUser', async () => {
      await addMessages(messagesWorklessUser);
      const collection = await worklessUserStat.collect({ chat: { id: 1 }, date: 1588982400 });
      expect(collection).toEqual(
        [{
          _id: 2,
          count: 3,
          first_name: 'test2',
          last_name: 'test2',
          username: 'test2',
        }],
      );

      const statString = worklessUserStat.render(collection);

      expect(statString).toBe('[test2 test2](tg://user?id=2) - безработный');
    });

    test('empty data', async () => {
      const collection = await worklessUserStat.collect({ chat: { id: 1 }, date: 1588982400 });
      expect(collection).toEqual([]);


      const statString = worklessUserStat.render(collection);

      expect(statString).toBe('');
    });
  });
});
