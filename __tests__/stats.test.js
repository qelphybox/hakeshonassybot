// hours timestamp search = 1589133600
const { statFunctions, stats } = require('../src/stats');
const { addMessages, removeAllMessages } = require('./lib/dbHelper');
const messagesByHour = require('./__fixtures__/messagesByHourFixtures/correctData.json');
const messagesByDay = require('./__fixtures__/messagesByDayFixtures/correctData.json');
const messagesWorklessUser = require('./__fixtures__/messagesWorklessUser/correctData.json');


describe('statByHour', () => {
  afterEach(() => {
    removeAllMessages();
  });
  test('statByHour', async () => {
    await addMessages(messagesByHour);
    const data = await statFunctions.statByHour({ chatId: 1, messageTimestamp: 1589133600 });
    expect(data).toEqual({
      data: [
        { _id: 2, count: 3, username: 'test2' },
        { _id: 1, count: 2, username: 'test1' },
      ],
      name: stats.HOUR_MESSAGE_COUNT,
    });
  });

  test('empty data', async () => {
    const data = await statFunctions.statByHour({ chatId: 1, messageTimestamp: 1589133600 });
    expect(data).toEqual({
      data: [], name: stats.HOUR_MESSAGE_COUNT,
    });
  });
});

describe('statByDay', () => {
  afterEach(() => {
    removeAllMessages();
  });
  test('statByDay', async () => {
    await addMessages(messagesByDay);
    const data = await statFunctions.statByDay({ chatId: 1, messageTimestamp: 1589155200 });
    expect(data).toEqual({
      data: [
        { _id: 2, count: 3, username: 'test2' },
        { _id: 1, count: 2, username: 'test1' },
      ],
      name: stats.TODAY_MESSAGE_COUNT,
    });
  });
  test('empty data', async () => {
    const data = await statFunctions.statByDay({ chatId: 1, messageTimestamp: 1589155200 });
    expect(data).toEqual({
      data: [], name: stats.TODAY_MESSAGE_COUNT,
    });
  });
});

describe('worklessUser', () => {
  afterEach(() => {
    removeAllMessages();
  });
  test('worklessUser', async () => {
    await addMessages(messagesWorklessUser);
    const data = await statFunctions.worklessUser({ chatId: 1, messageTimestamp: 1588982400 });
    expect(data).toEqual({
      data:
        [{ _id: 2, count: 3, username: 'test2' }],
      name: stats.WORKLESS_USER,
    });
  });
  test('empty data', async () => {
    const data = await statFunctions.worklessUser({ chatId: 1, messageTimestamp: 1588982400 });
    expect(data).toEqual({
      data: [],
      name: stats.WORKLESS_USER,
    });
  });
});
