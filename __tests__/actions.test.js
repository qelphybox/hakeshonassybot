jest.mock('./__mocks__/slimbot');
const { onMessage } = require('../src/actions');
const { dbClient } = require('../src/dbClient');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const messagesWorklessUser = require('./__fixtures__/messagesWorklessUser/correctData.json');
const messagesContentSupplier = require('./__fixtures__/messagesContentSupplier/correctData.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};

const createMockedSlimbot = (expectedText) => ({
  sendMessage: jest.fn((chatId, text) => {
    expect(text).toMatch(expectedText);
  }),
});

describe('auto create messages', () => {
  test('empty data', async () => {
    const slimbot = createMockedSlimbot('Сообщений за последние 24 часа: \n'
      + 'Сообщений за последний час: ');

    const message = {
      chat: {
        id: 0,
      },
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, message);
  });

  test('messagesContentSupplier', async () => {
    await addMessages(messagesContentSupplier);

    const slimbot = createMockedSlimbot('Сообщений за последние 24 часа: test1 test1 (2)\n'
      + 'Сообщений за последний час: test1 test1 (2)\n'
      + 'test1 test1 - безработный\n'
      + 'test1 test1 - поставщик контента');

    const message = {
      chat: {
        id: 1,
      },
      date: 1588982400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, message);
  });

  test('messagesWorklessUser', async () => {
    await addMessages(messagesWorklessUser);

    const slimbot = createMockedSlimbot('Сообщений за последние 24 часа: test1 test1 (2)\n'
      + 'Сообщений за последний час: test1 test1 (2)\n'
      + 'test2 test2 - безработный');

    const message = {
      chat: {
        id: 1,
      },
      date: 1588982400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, message);
  });
});
