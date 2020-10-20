const moment = require('moment');
const { onMessage } = require('../src/actions');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

const createMockedSlimbot = (sendMessageFn) => ({ sendMessage: jest.fn(sendMessageFn) });

describe('manual create messages', () => {
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
