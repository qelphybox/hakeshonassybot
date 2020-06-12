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

const createMockedSlimbot = (sendMessageFn) => ({ sendMessage: jest.fn(sendMessageFn) });

describe('auto create messages', () => {
  test('empty data', async () => {
    const expectedText = `Сообщений за последние 24 часа: 
Сообщений за последний час: `;

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

    const expectedText = `Сообщений за последние 24 часа: test1 test1 (2)
Сообщений за последний час: test1 test1 (2)
test1 test1 - безработный
test1 test1 - поставщик контента`;

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

    const expectedText = `Сообщений за последние 24 часа: test1 test1 (2)
Сообщений за последний час: test1 test1 (2)
test2 test2 - безработный`;

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

describe('manual create messages', () => {
  test('workless user', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('user1 - безработный');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591815600, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591815600, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591815600, type: 'text',
    }, onMessage, slimbot);

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
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('user2 - худший юзер чата');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'voice',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'voice',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'voice',
    }, onMessage, slimbot);

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
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('user2 - поставщик контента');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'photo',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'photo',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'video',
    }, onMessage, slimbot);

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
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('Сообщений за последние 24 часа: user1 (23), user2 (11), user3 (7)');
    });
    const start24HourDate = 1591833600; // 11.06.2020 00:00
    const end24HourDate = 1591920000; // 12.06.2020 00:00
    const oneHour = 3600;
    const sendMessagesArray = [];

    // user1 sends message every hour
    for (
      let sendMessageDate = start24HourDate;
      sendMessageDate < end24HourDate;
      sendMessageDate += oneHour
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 1, firstName: 'user1', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    // user2 sends message every two hours
    for (
      let sendMessageDate = start24HourDate;
      sendMessageDate < end24HourDate;
      sendMessageDate += oneHour * 2
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 2, firstName: 'user2', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    // user3 sends message every three hours
    for (
      let sendMessageDate = start24HourDate;
      sendMessageDate < end24HourDate;
      sendMessageDate += oneHour * 3
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 3, firstName: 'user3', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    await Promise.all(sendMessagesArray);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: end24HourDate,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('one hour', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('Сообщений за последний час: user1 (59), user2 (5), user3 (2)');
    });

    const startHourDate = 1591833600; // 11.06.2020 00:00
    const endHourDate = 1591837200; // 11.06.2020 01:00
    const oneMinute = 60;
    const sendMessagesArray = [];

    // user1 sends message every minute
    for (
      let sendMessageDate = startHourDate;
      sendMessageDate < endHourDate;
      sendMessageDate += oneMinute
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 1, firstName: 'user1', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    // user2 sends message every ten minutes
    for (
      let sendMessageDate = startHourDate;
      sendMessageDate < endHourDate;
      sendMessageDate += oneMinute * 10
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 2, firstName: 'user2', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    // user3 sends message every twenty minutes
    for (
      let sendMessageDate = startHourDate;
      sendMessageDate < endHourDate;
      sendMessageDate += oneMinute * 20
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 3, firstName: 'user3', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    await Promise.all(sendMessagesArray);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: endHourDate,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });
});
