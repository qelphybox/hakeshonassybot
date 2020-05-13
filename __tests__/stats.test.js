// hours timestamp search = 1589133600
const {statFunctions, stats} = require('../src/stats');
const { addMessages, removeAllMessages} = require('./lib/dbHelper');
const messagesByHour = require('./__fixtures__/messagesByHour.json');
const messagesByDay = require('./__fixtures__/messagesByDay.json');
const messagesWorklessUser = require('./__fixtures__/messagesWorklessUser.json');

afterEach(() => {
  removeAllMessages();
});

describe('statByHour', () => {
  test('statByHour', async () => {
    await addMessages(messagesByHour)
    const data = await statFunctions.statByHour({chatId: 1, messageTimestamp: 1589133600})
    expect(data).toEqual({
        "data": [
          {_id: 2, count: 3, username: 'test2'},
          {_id: 1, count: 2, username: 'test1'},
        ], "name": stats.HOUR_MESSAGE_COUNT
      }
    );
  });
});

describe('statByDay', () => {
  test('statByDay', async () => {
    await addMessages(messagesByDay)
    const data = await statFunctions.statByDay({chatId: 1, messageTimestamp: 1589155200})
    expect(data).toEqual({
        "data": [
          {_id: 2, count: 3, username: 'test2'},
          {_id: 1, count: 2, username: 'test1'},
        ], "name": stats.TODAY_MESSAGE_COUNT
      }
    );
  });
});

describe('worklessUser', () => {
  test('worklessUser', async () => {
    await addMessages(messagesWorklessUser)
    const data = await statFunctions.worklessUser({chatId: 1, messageTimestamp: 1588982400})
    expect(data).toEqual({
      data:
        [{ _id: 2, count: 3, username: 'test2' }],
      name: stats.WORKLESS_USER
      }
    );
  });
});
