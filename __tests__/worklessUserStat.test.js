const worklessUserStat = require('../src/statistics/worklessUserStat');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const messagesWorklessUser = require('./__fixtures__/messagesWorklessUser/correctData.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};
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

    expect(statString).toBe('test2 test2 - безработный');
  });

  // test('empty data', async () => {
  //   const collection = await worklessUserStat.collect({ chat: { id: 1 }, date: 1588982400 });
  //   expect(collection).toEqual([]);
  //
  //
  //   const statString = worklessUserStat.render(collection);
  //
  //   expect(statString).toBe('');
  // });

  test('sunday timestamp request', async () => {
    await addMessages(messagesWorklessUser);
    const collection = await worklessUserStat.collect({ chat: { id: 1 }, date: 1589130000 });
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

    expect(statString).toBe('test2 test2 - безработный');
  });
});
