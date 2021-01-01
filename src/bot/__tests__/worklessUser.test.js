const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

describe('workless user', () => {
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
});
