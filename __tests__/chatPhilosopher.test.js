const chatPholosopher = require('../src/statistics/chatPhilosopher');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const evenNumberOfMessages = require('./__fixtures__/chatPhilosopher/chatPholosopherEvenNumbersOfMessages.json');
const notEvenNumberOfMessages = require('./__fixtures__/chatPhilosopher/chatPholosopherNotEvenNumbersOfMessages.json');
const severalChatPhilosophers = require('./__fixtures__/chatPhilosopher/severalChatPhilosophers.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((collection) => collection.insertMany(messages));
};

describe('chatPhilosopher', () => {
  test('evenNumberOfMessages', async () => {
    await addMessages(evenNumberOfMessages);
    const collection = await chatPholosopher.collect({ chat: { id: 1 } });
    expect(collection).toEqual([
      {
        _id: 1,
        count: 4,
        first_name: 'test1',
        last_name: 'test1',
        username: 'test1',
        all_msg_len_array: [
          10, 12, 12, 14,
        ],
        middle_index: 2,
        middle_index_less: 1,
        median: 12,
      },
      {
        _id: 2,
        count: 4,
        first_name: 'test2',
        last_name: 'test2',
        username: 'test2',
        all_msg_len_array: [
          3, 3, 3, 3,
        ],
        middle_index: 2,
        middle_index_less: 1,
        median: 3,
      },
    ]);
    const statString = await chatPholosopher.render(collection);

    expect(statString).toBe('*test1 test1* - философ чата (медианная длина сообщений 12)');
  });
  test('notEvenNumberOfMessages', async () => {
    await addMessages(notEvenNumberOfMessages);
    const collection = await chatPholosopher.collect({ chat: { id: 1 } });
    expect(collection).toEqual([
      {
        _id: 1,
        count: 5,
        first_name: 'test1',
        last_name: 'test1',
        username: 'test1',
        all_msg_len_array: [
          10, 12, 12, 12, 14,
        ],
        middle_index: 2,
        middle_index_less: 1,
        median: 12,
      },
      {
        _id: 2,
        count: 3,
        first_name: 'test2',
        last_name: 'test2',
        username: 'test2',
        all_msg_len_array: [
          3, 3, 3,
        ],
        middle_index: 1,
        middle_index_less: 0,
        median: 3,
      },
    ]);
    const statString = await chatPholosopher.render(collection);

    expect(statString).toBe('*test1 test1* - философ чата (медианная длина сообщений 12)');
  });
  test('severalChatPhilosophers', async () => {
    await addMessages(severalChatPhilosophers);
    const collection = await chatPholosopher.collect({ chat: { id: 1 } });
    expect(collection).toEqual([
      {
        _id: 1,
        count: 5,
        first_name: 'test1',
        last_name: 'test1',
        username: 'test1',
        all_msg_len_array: [
          10, 12, 12, 12, 14,
        ],
        middle_index: 2,
        middle_index_less: 1,
        median: 12,
      },
      {
        _id: 2,
        count: 3,
        first_name: 'test2',
        last_name: 'test2',
        username: 'test2',
        all_msg_len_array: [
          12, 12, 12,
        ],
        middle_index: 1,
        middle_index_less: 0,
        median: 12,
      },
      {
        _id: 3,
        count: 3,
        first_name: 'test3',
        last_name: 'test3',
        username: 'test3',
        all_msg_len_array: [
          3, 3, 3,
        ],
        middle_index: 1,
        middle_index_less: 0,
        median: 3,
      },
    ]);
    const statString = await chatPholosopher.render(collection);

    expect(statString).toBe('*test1 test1, test2 test2* - философы чата (медианная длина сообщений 12)');
  });
  test('empty data', async () => {
    const collection = await chatPholosopher.collect({ chat: { id: 1 } });
    expect(collection).toStrictEqual([]);

    const statString = await chatPholosopher.render(collection);
    expect(statString).toBe('');
  });
});
