const moment = require('moment');
const { onMessage, onMessageEdit } = require('../actions');
const { dbClient } = require('../../dbClient');

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

    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch(expectedText);
    });

    const message = {
      chat: {
        id: 0,
      },
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, message);
  });

  test('messagesContentSupplier', async () => {
    await addMessages(messagesContentSupplier);

    const expectedText = `*Сообщений за последние 24 часа:* test1 test1 (2)
*Сообщений за последний час:* test1 test1 (2)
*test1 test1* - безработный (3 сообщения в рабочее время за неделю)
*test1 test1* - поставщик контента (2 картинки, 1 видео)`;

    const bot = createMockedSlimbot((chatId, text) => {
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

    await onMessage(bot, message);
  });

  test('messagesWorklessUser', async () => {
    await addMessages(messagesWorklessUser);

    const expectedText = `*Сообщений за последние 24 часа:* test1 test1 (2)
*Сообщений за последний час:* test1 test1 (2)
*test2 test2* - безработный (3 сообщения в рабочее время за неделю)`;

    const bot = createMockedSlimbot((chatId, text) => {
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

    await onMessage(bot, message);
  });
});

describe('on message edit action', () => {
  test('updates message in collection', async () => {
    const chat = {
      id: -379023065,
      title: 'hakeshonassybot_develop_bot',
      type: 'group',
      all_members_are_administrators: true,
    };

    const firstMessage = {
      message_id: 503,
      from: {
        id: 309091867,
        is_bot: false,
        first_name: 'Sergey',
        last_name: 'Vyborov',
        username: 'svyborov',
        language_code: 'en',
      },
      chat,
      date: 1603056894,
      text: 'test1',
    };

    await onMessage(null, firstMessage);
    await dbClient.queryMessages(async (col) => {
      const message = await col.findOne({ message_id: firstMessage.message_id });
      expect(message).toEqual(firstMessage);
    });
    const editedMessage = {
      message_id: 503,
      from: {
        id: 309091867,
        is_bot: false,
        first_name: 'Sergey1',
        last_name: 'Vyborov1',
        username: 'svyborov',
        language_code: 'en',
      },
      chat,
      date: 1603056895,
      edit_date: 1603056911,
      text: 'test2',
    };
    await onMessageEdit(null, editedMessage);

    await dbClient.queryMessages(async (col) => {
      const message = await col.findOne({ message_id: firstMessage.message_id });
      expect(message).toMatchObject(editedMessage);
    });
  });
});
