const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

describe('worst user', () => {
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
});
