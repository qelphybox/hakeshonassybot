jest.mock('./__mocks__/slimbot');
const { onMessage } = require('../src/actions');
const { dbClient } = require('../src/dbClient');
const { sendTestMessage } = require('./lib/sendMessageHelper');

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

describe('manual create messages', () => {
  test('workless user', async () => {
    const slimbot = createMockedSlimbot('user1 - безработный');

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
    }, slimbot);
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
    }, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, slimbot);

    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591815600, type: 'text',
    }, slimbot);
    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591815600, type: 'text',
    }, slimbot);
    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591815600, type: 'text',
    }, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1591887600,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });


  test('worst user', async () => {
    const slimbot = createMockedSlimbot('user2 - худший юзер чата');

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'voice',
    }, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'voice',
    }, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'voice',
    }, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1591887600,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('content supplier', async () => {
    const slimbot = createMockedSlimbot('user2 - поставщик контента');

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'photo',
    }, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'photo',
    }, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'video',
    }, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1591887600,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('24 hours', async () => {
    const slimbot = createMockedSlimbot('Сообщений за последние 24 часа: user1 (23), user2 (11), user3 (8)');

    const sendMessagesArray = [];
    for (let i = 1591833600; i < 1591920000; i += 3600) {
      sendMessagesArray.push(sendTestMessage({
        userId: 1, firstName: 'user1', date: i, type: 'text',
      }, slimbot));
    }

    for (let i = 1591833600; i < 1591920000; i += 7200) {
      sendMessagesArray.push(sendTestMessage({
        userId: 2, firstName: 'user2', date: i, type: 'text',
      }, slimbot));
    }

    for (let i = 1591833600; i < 1591920000; i += 10600) {
      sendMessagesArray.push(sendTestMessage({
        userId: 3, firstName: 'user3', date: i, type: 'text',
      }, slimbot));
    }

    await Promise.all(sendMessagesArray);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1591920000,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('one hour', async () => {
    const slimbot = createMockedSlimbot('Сообщений за последний час: user1 (59), user2 (5), user3 (2)');

    const sendMessagesArray = [];
    for (let i = 1591833600; i < 1591837200; i += 60) {
      sendMessagesArray.push(sendTestMessage({
        userId: 1, firstName: 'user1', date: i, type: 'text',
      }, slimbot));
    }

    for (let i = 1591833600; i < 1591837200; i += 600) {
      sendMessagesArray.push(sendTestMessage({
        userId: 2, firstName: 'user2', date: i, type: 'text',
      }, slimbot));
    }

    for (let i = 1591833600; i < 1591837200; i += 1200) {
      sendMessagesArray.push(sendTestMessage({
        userId: 3, firstName: 'user3', date: i, type: 'text',
      }, slimbot));
    }

    await Promise.all(sendMessagesArray);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1591837200,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });
});
