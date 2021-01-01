const moment = require('moment');
const MockDate = require('mockdate');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

describe('maybe dead', () => {
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
      expect(text).toMatch('*user1* - наверное помер (писал менее 1 дня назад)');
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
});
