const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestReplyMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

const massageForReplay = {
  message_id: 1,
  from: {
    id: 1,
    is_bot: false,
    first_name: 'user1',
  },
  chat: {
    id: 1,
  },
  date: 1591786800, // Wed, 10 Jun 2020 11:00:00 GMT
  text: 'ты лалка',
};

describeDBSetupTeardown();
moment.locale('ru');

describe('manual create messages', () => {
  test('humorist text only', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - Юморист недели (10 кеков)');
    });

    await onMessage(bot, massageForReplay);

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591786800, type: 'text', massageForReplay,
    }, onMessage, bot, 'хах');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text', massageForReplay,
    }, onMessage, bot, 'кек');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790500, type: 'text', massageForReplay,
    }, onMessage, bot, 'лол');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790600, type: 'text', massageForReplay,
    }, onMessage, bot, 'ахах');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790700, type: 'text', massageForReplay,
    }, onMessage, bot, 'хаха');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790800, type: 'text', massageForReplay,
    }, onMessage, bot, 'азазаз');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790900, type: 'text', massageForReplay,
    }, onMessage, bot, 'аъаъаъаъ');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591791000, type: 'text', massageForReplay,
    }, onMessage, bot, 'f[f[f[');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591792400, type: 'text', massageForReplay,
    }, onMessage, bot, ']f]f]f]');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591793400, type: 'text', massageForReplay,
    }, onMessage, bot, 'hahahahah');

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

  test('humorist emoji only', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - Юморист недели (6 кеков)');
    });

    await onMessage(bot, massageForReplay);

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591786800, type: 'text', massageForReplay,
    }, onMessage, bot, '😆');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text', massageForReplay,
    }, onMessage, bot, '😅');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790500, type: 'text', massageForReplay,
    }, onMessage, bot, '🤣');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790600, type: 'text', massageForReplay,
    }, onMessage, bot, '😂');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790700, type: 'text', massageForReplay,
    }, onMessage, bot, '😀');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790800, type: 'text', massageForReplay,
    }, onMessage, bot, '😃');

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

  test('humorist sticker only', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - Юморист недели (1 кек)');
    });

    await onMessage(bot, massageForReplay);

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591786800, type: 'sticker', massageForReplay,
    }, onMessage, bot, { setName: 'ultrarjombav2' });

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

  test('humorist weekly stat', async () => {
    const bot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*user1* - Юморист недели (3 кека)');
    });

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'sticker', massageForReplay, // Wed, 10 Jun 2020 12:00:00 GMT
    }, onMessage, bot, { setName: 'ultrarjombav2' });

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1592046000, type: 'text', massageForReplay, // Sat, 13 Jun 2020 11:00:00 GMT
    }, onMessage, bot, 'хахахах');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1592132400, type: 'text', massageForReplay, //  Sun, 14 Jun 2020 11:00:00 GMT
    }, onMessage, bot, '😃');

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1592218800, type: 'sticker', massageForReplay, // Mon, 15 Jun 2020 11:00:00 GMT
    }, onMessage, bot, { setName: 'ultrarjombav2' });

    const statMessage = {
      chat: {
        id: 1,
      },
      date: 1592478000, // Thu, 18 Jun 2020 11:00:00 GMT
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(bot, statMessage);
  });
});
