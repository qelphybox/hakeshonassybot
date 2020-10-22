const moment = require('moment');
const { onMessage } = require('../src/actions');
const { sendTestMessage } = require('./lib/sendMessageHelper');
const { createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

describe('chatPhilosopher', () => {
  test('empty data', async () => {
    const expectedText = '';
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
  test('oneChatPhilosopher', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - философ чата (медианная длина сообщений 14)');
    });
    [5, 5, 5, 5, 3, 3, 3, 3].forEach(async (messageLength, i) => {
      await sendTestMessage({
        userId: 1, firstName: 'user1', date: 1591790400 + i, type: 'text',
      }, onMessage, slimbot, 'a'.repeat(messageLength));
    });

    [14, 14, 14, 14, 14, 3, 3, 3, 3].forEach(async (messageLength, i) => {
      await sendTestMessage({
        userId: 2, firstName: 'user2', date: 1591790400 + i, type: 'text',
      }, onMessage, slimbot, 'a'.repeat(messageLength));
    });
    [5, 3, 3, 3, 3, 3].forEach(async (messageLength, i) => {
      await sendTestMessage({
        userId: 3, firstName: 'user3', date: 1591790400 + i, type: 'text',
      }, onMessage, slimbot, 'a'.repeat(messageLength));
    });

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

  test('twoChatPhilosopher', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1, user2* - философы чата (медианная длина сообщений 14)');
    });
    [14, 14, 14, 14, 14, 14, 3, 3, 3, 3].forEach(async (messageLength, i) => {
      await sendTestMessage({
        userId: 1, firstName: 'user1', date: 1591790400 + i, type: 'text',
      }, onMessage, slimbot, 'a'.repeat(messageLength));
    });

    [14, 14, 14, 14, 14, 3, 3, 3, 3].forEach(async (messageLength, i) => {
      await sendTestMessage({
        userId: 2, firstName: 'user2', date: 1591790400 + i, type: 'text',
      }, onMessage, slimbot, 'a'.repeat(messageLength));
    });
    [5, 3, 3, 3, 3, 3].forEach(async (messageLength, i) => {
      await sendTestMessage({
        userId: 3, firstName: 'user3', date: 1591790400 + i, type: 'text',
      }, onMessage, slimbot, 'a'.repeat(messageLength));
    });

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
