const moment = require('moment');
const MockDate = require('mockdate');
const { onMessage } = require('../src/actions');
const { dbClient } = require('../src/dbClient');
const { sendTestMessage } = require('./lib/sendMessageHelper');

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

describe('manual create messages', () => {
  test('workless user', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - безработный (2 сообщения в рабочее время за неделю)');
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

  test('workless user one message', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - безработный (1 сообщение в рабочее время за неделю)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
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
      expect(text).toMatch('*user2* - худший юзер чата (послал 2 голосовых)');
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

  test('worst user five messages', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - худший юзер чата (послал 5 голосовых)');
    });

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'voice',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'voice',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'voice',
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
      expect(text).toMatch('*user2* - поставщик контента (1 картинка, 2 видео)');
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
      expect(text).toMatch('*Сообщений за последние 24 часа:* user1 (23), user2 (11), user3 (7)');
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
      expect(text).toMatch('*Сообщений за последний час:* user1 (59), user2 (5), user3 (2)');
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

  test('workless user monday messages, tuesday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - безработный (2 сообщения в рабочее время за неделю)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592218800, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592218800, type: 'text',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'text',
    }, onMessage, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592316000,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('content supplier monday messages, tuesday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента ');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592218800, type: 'photo',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'photo',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'video',
    }, onMessage, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592316000,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('workless user monday messages, sunday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - безработный (2 сообщения в рабочее время за неделю)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592218800, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592218800, type: 'text',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'text',
    }, onMessage, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592737200,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('content supplier monday messages, sunday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента (1 картинка, 1 видео)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592218800, type: 'photo',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'photo',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'video',
    }, onMessage, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592737200,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('workless user monday messages, monday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - безработный (2 сообщения в рабочее время за неделю)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592211660, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592211660, type: 'text',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592211660, type: 'text',
    }, onMessage, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592222400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('content supplier monday messages, monday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента (1 картинка, 1 видео)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592211660, type: 'photo',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592211660, type: 'photo',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592211660, type: 'video',
    }, onMessage, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592222400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('content supplier thursday messages, monday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента (1 картинка, 1 видео)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'photo',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591866060, type: 'photo',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591866060, type: 'video',
    }, onMessage, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592222400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('workless user thursday messages, monday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - безработный (2 сообщения в рабочее время за неделю)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'text',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591866060, type: 'text',
    }, onMessage, slimbot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592222400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('sticker packer', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - стикерпакер (юзает 2 стикерпака)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'sticker',
    }, onMessage, slimbot, { setName: 'Pojelaniepchelki' });
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'sticker',
    }, onMessage, slimbot, { setName: 'ultrarjombav2' });

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591866060, type: 'sticker',
    }, onMessage, slimbot, { setName: 'ultrarjombav2' });

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591866060, type: 'sticker',
    }, onMessage, slimbot, { setName: 'ultrarjombav2' });

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591866060, type: 'sticker',
    }, onMessage, slimbot, { setName: 'ultrarjombav2' });

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592222400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('sticker packer one message', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - стикерпакер (юзает 1 стикерпак)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'sticker',
    }, onMessage, slimbot, { setName: 'Pojelaniepchelki' });

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592222400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('maybe died', async () => {
    const dateToTest = 1592870400000; // 23.06.2020
    MockDate.set(moment(dateToTest));

    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - наверное помер (писал 12 дней назад)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786900, type: 'text',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591787100, type: 'text',
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591786700, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591786800, type: 'text',
    }, onMessage, slimbot);
    await sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591787000, type: 'text',
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

  test('maybe died (less than one day)', async () => {
    const dateToTest = 1591747200000; // 10.06.2020
    MockDate.set(moment(dateToTest));

    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - наверное помер (писал 1 день назад)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
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

  test('dud', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - Дудь (задал 2 вопроса)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
      messageContentObj: { text: 'Как дела?' },
    }, onMessage, slimbot, 'Как дела?');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
      messageContentObj: { text: '?' },
    }, onMessage, slimbot, '?');
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
      messageContentObj: { text: 'Норм. А у тебя?' },
    }, onMessage, slimbot, 'Норм. А у тебя?' );

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

  test('dud five messages', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - Дудь (задал 5 вопросов)');
    });

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
      messageContentObj: { text: 'Как дела?' },
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot, { text: '?' });

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot, 'Как дела? Норм');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
      messageContentObj: { text: '??' },
    }, onMessage, slimbot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
      messageContentObj: { text: '?' },
    }, onMessage, slimbot, '?');

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
  test('rickroll', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('[Самый сильный младенец купил бмв](https://www.youtube.com/watch?v=dQw4w9WgXcQ)');
    });

    const rickMessage = {
      chat: {
        id: 1,
      },
      text: '/rickroll',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, rickMessage);
  });
});
