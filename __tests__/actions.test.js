const moment = require('moment');
const { onMessage } = require('../src/actions');
const { dbClient } = require('../src/dbClient');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const messagesWorklessUser = require('./__fixtures__/messagesWorklessUser/correctData.json');
const messagesContentSupplier = require('./__fixtures__/messagesContentSupplier/correctData.json');

describeDBSetupTeardown();
moment.locale('ru');

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};

const createMockedSlimbot = (sendMessageFn) => ({ sendMessage: jest.fn(sendMessageFn) });

describe('auto create messages', () => {
  test('empty data', async () => {
    const expectedText = `*Сообщений за последние 24 часа:* 
*Сообщений за последний час:* `;

    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch(expectedText);
    });

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

    const expectedText = `*Сообщений за последние 24 часа:* test1 test1 (2)
*Сообщений за последний час:* test1 test1 (2)
*test1 test1* - безработный (3 сообщения в рабочее время за неделю)
*test1 test1* - поставщик контента (2 картинки, 1 видео)`;

    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch(expectedText);
    });

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

    const expectedText = `*Сообщений за последние 24 часа:* test1 test1 (2)
*Сообщений за последний час:* test1 test1 (2)
*test2 test2* - безработный (3 сообщения в рабочее время за неделю)`;

    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch(expectedText);
    });

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
