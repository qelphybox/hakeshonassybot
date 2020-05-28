const { onMessage } = require('../src/actions');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();

class MockSlimbot {
  constructor(testCallback) {
    this.testCallback = testCallback;
  }

  sendMessage(chatId, text, params) {
    this.text = text;
    this.chatId = chatId;
    this.params = params;
    this.testCallback();
  }
}

describe('onMessage', () => {
  test('empty data', () => new Promise((done) => {
    const testCallback = () => {
      expect(this.text).toBe('Сообщений за последние 24 часа: \n'
        + 'Сообщений за последний час: ');
      done();
    };
    const slimbot = new MockSlimbot(done, testCallback);
    const message = {
      chat: {
        id: 0,
      },
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    onMessage(slimbot, message);
  }));
});
