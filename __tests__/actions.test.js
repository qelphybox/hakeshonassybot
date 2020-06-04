jest.mock('./__mocks__/slimbot');
const MockSlimbot = require('slimbot');
const { onMessage } = require('../src/actions');
const { dbClient } = require('../src/dbClient');

const { describeDBSetupTeardown } = require('./lib/dbHelper');


describeDBSetupTeardown();

const messagesWorklessUser = require('./__fixtures__/messagesWorklessUser/correctData.json');
const messagesContentSupplier = require('./__fixtures__/messagesContentSupplier/correctData.json');

describeDBSetupTeardown();

const addMessages = async (messages) => {
  await dbClient.queryMessages((col) => col.insertMany(messages));
};

describe('onMessage', () => {
  test('empty data', () => new Promise((done) => {
    const testCallback = (text) => {
      expect(text).toBe('Сообщений за последние 24 часа: \n'
        + 'Сообщений за последний час: ');
      done();
    };
    const slimbot = new MockSlimbot(testCallback);
    const message = {
      chat: {
        id: 0,
      },
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    onMessage(slimbot, message);
  }));

  test('messagesContentSupplier', () => new Promise((done) => {
    addMessages(messagesContentSupplier).then(() => {
      const testCallback = (text) => {
        expect(text).toBe('Сообщений за последние 24 часа: test1 test1 (2)\n'
          + 'Сообщений за последний час: test1 test1 (2)\n'
          + 'test1 test1 - безработный\n'
          + 'test1 test1 - поставщик контента');
        done();
      };
      const slimbot = new MockSlimbot(testCallback);
      const message = {
        chat: {
          id: 1,
        },
        date: 1588982400,
        text: '/stats',
        entities: [{ type: 'bot_command' }],
      };

      onMessage(slimbot, message);
    });
  }));

  test('messagesWorklessUser', () => new Promise((done) => {
    addMessages(messagesWorklessUser).then(() => {
      const testCallback = (text) => {
        expect(text).toBe('Сообщений за последние 24 часа: test1 test1 (2)\n'
          + 'Сообщений за последний час: test1 test1 (2)\n'
          + 'test2 test2 - безработный');
        done();
      };
      const slimbot = new MockSlimbot(testCallback);
      const message = {
        chat: {
          id: 1,
        },
        date: 1588982400,
        text: '/stats',
        entities: [{ type: 'bot_command' }],
      };

      onMessage(slimbot, message);
    });
  }));
});
