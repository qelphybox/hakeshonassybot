const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

describe('manual create messages', () => {
  test('dud', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - Дудь (задал 2 вопроса за неделю)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text',
    }, onMessage, slimbot, 'Как дела?');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot, '?');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot, 'Норм. А у тебя?');

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
      expect(text).toMatch('*user2* - Дудь (задал 5 вопросов за неделю)');
    });

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot, 'Как дела?');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot, '?');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot, 'Как дела? Норм');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
    }, onMessage, slimbot, '??');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text',
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

  test('dud sunday and monday messages, next sunday stats', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - Дудь (задал 2 вопроса за неделю)');
    });

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592125260, type: 'text', // Sunday, 14-Jun-20 09:01:00 UTC
    }, onMessage, slimbot, 'Как дела?');
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592211660, type: 'text', // Monday, 15-Jun-20 09:01:00 UTC
    }, onMessage, slimbot, 'Как дела?');
    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1592211660, type: 'text',
    }, onMessage, slimbot, '??');

    await sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592211660, type: 'text',
    }, onMessage, slimbot, '?');

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592730060, // Sunday, 21-Jun-20 09:01:00 UTC
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });
});
