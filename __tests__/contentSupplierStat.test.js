const contentSupplierStat = require('../src/statistics/contentSupplierStat');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const messagesContentSupplier = require('./__fixtures__/messagesContentSupplier/correctData.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};
describe('contentSupplierStat', () => {
  test('contentSupplierStat', async () => {
    await addMessages(messagesContentSupplier);
    const collection = await contentSupplierStat.collect({ chat: { id: 1 }, date: 1588982400 });
    expect(collection).toEqual(
      [{
        _id: 1,
        count: 3,
        first_name: 'test1',
        last_name: 'test1',
        username: 'test1',
      }],
    );

    const statString = contentSupplierStat.render(collection);

    expect(statString).toBe('*test1 test1* - поставщик контента');
  });

  test('empty data', async () => {
    const collection = await contentSupplierStat.collect({ chat: { id: 1 }, date: 1588982400 });
    expect(collection).toEqual([]);

    const statString = contentSupplierStat.render(collection);

    expect(statString).toBe('');
  });
});
