const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

// TODO: REMOVE SKIP
/* eslint-disable */
describe.skip('Weekly philosopher', () => {
  test('empty data', async () => {
    const expectedText = '';
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
  test('oneWeeklyPhilosopher', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user2* - философ недели (медианная длина сообщений 14)');
    });
    await Promise.all([14, 20, 30, 15, 17, 14, 28, 34].map((messageLength, i) => sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866000 + i, type: 'text', // Thu, 11 Jun 2020 09:00:00
    }, onMessage, bot, 'a'.repeat(messageLength))));

    await Promise.all([14, 14, 14, 14, 14, 3, 3, 3, 3].map((messageLength, i) => sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592391600 + i, type: 'text', // Wed, 17 Jun 2020 11:00:00
    }, onMessage, bot, 'a'.repeat(messageLength))));
    await Promise.all([5, 3, 3, 3, 3, 3].map((messageLength, i) => sendTestMessage({
      userId: 3, firstName: 'user3', date: 1592301600 + i, type: 'text', // Tue, 16 Jun 2020 10:00:00
    }, onMessage, bot, 'a'.repeat(messageLength))));

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592560800, // Fri, 19 Jun 2020 10:00:00
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });

  test('twoWeeklyPhilosopher', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1, user2* - философы недели (медианная длина сообщений 14)');
    });
    await Promise.all([14, 14, 14, 14, 14, 14, 3, 3, 3, 3].map(
      (messageLength, i) => sendTestMessage({
        userId: 1, firstName: 'user1', date: 1592391600 + i, type: 'text', // Wed, 17 Jun 2020 11:00:00
      }, onMessage, bot, 'a'.repeat(messageLength)),
    ));

    await Promise.all([14, 14, 14, 14, 14, 3, 3, 3, 3].map((messageLength, i) => sendTestMessage({
      userId: 2, firstName: 'user2', date: 1592301600 + i, type: 'text', // Tue, 16 Jun 2020 10:00:00
    }, onMessage, bot, 'a'.repeat(messageLength))));
    await Promise.all([23, 40, 35, 42, 12, 32, 25].map((messageLength, i) => sendTestMessage({
      userId: 3, firstName: 'user3', date: 1591866060 + i, type: 'text', // Thu, 11 Jun 2020 09:01:00
    }, onMessage, bot, 'a'.repeat(messageLength))));

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592560800, // Fri, 19 Jun 2020 10:00:00
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });
  test('twoWeeklyPhilosopher monday messages, monday stats', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1, user2* - философы недели (медианная длина сообщений 14)');
    });
    await Promise.all(
      [14, 14, 14, 14, 14, 14, 3, 3, 3, 3].map((messageLength, i) => sendTestMessage({
        userId: 1, firstName: 'user1', date: 1603108800 + i, type: 'text', // Mon, 19 Oct 2020 12:00:00
      }, onMessage, bot, 'a'.repeat(messageLength))),
    );

    await Promise.all([14, 14, 14, 14, 14, 3, 3, 3, 3].map((messageLength, i) => sendTestMessage({
      userId: 2, firstName: 'user2', date: 1603108800 + i, type: 'text', // Mon, 19 Oct 2020 12:00:00
    }, onMessage, bot, 'a'.repeat(messageLength))));
    await Promise.all([23, 40, 35, 42, 12, 32, 25].map((messageLength, i) => sendTestMessage({
      userId: 3, firstName: 'user3', date: 1602327600 + i, type: 'text', // Sat, 10 Oct 2020 11:00:00
    }, onMessage, bot, 'a'.repeat(messageLength))));

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1603706400, // Mon, 26 Oct 2020 10:00:00
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });
});
