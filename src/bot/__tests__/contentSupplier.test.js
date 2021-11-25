const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

describe('manual create messages', () => {
  test('content supplier', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента (3 картинки, 4 видео)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'photo',
    }, onMessage, bot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'photo',
    }, onMessage, bot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'video',
    }, onMessage, bot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'video',
    }, onMessage, bot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, bot, 'https://www.youtube.com/watch?v=rHIfa7L0sww');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, bot, 'https://www.youtu.be/watch?v=rHIfa7L0sww');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, bot, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/VK.com-logo.svg/1200px-VK.com-logo.svg.png');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, bot, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/VK.com-logo.svg/1200px-VK.com-logo.svg.jpg');

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1591887600,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });
  test('content supplier monday messages, tuesday stats', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента ');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592218800, type: 'photo',
    }, onMessage, bot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'photo',
    }, onMessage, bot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'video',
    }, onMessage, bot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592316000,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });
  test('content supplier monday messages, sunday stats', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента (1 картинка, 1 видео)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592218800, type: 'photo',
    }, onMessage, bot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'photo',
    }, onMessage, bot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592226000, type: 'video',
    }, onMessage, bot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592737200,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });
  test('content supplier monday messages, monday stats', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента (1 картинка, 1 видео)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592211660, type: 'photo',
    }, onMessage, bot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592211660, type: 'photo',
    }, onMessage, bot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592211660, type: 'video',
    }, onMessage, bot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592222400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });

  test('content supplier thursday messages, monday stats', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - поставщик контента (1 картинка, 1 видео)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'photo',
    }, onMessage, bot);

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591866060, type: 'photo',
    }, onMessage, bot);
    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591866060, type: 'video',
    }, onMessage, bot);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592222400,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });
});
