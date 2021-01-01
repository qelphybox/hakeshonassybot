const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');

describeDBSetupTeardown();
moment.locale('ru');

describe('manual create messages', () => {
  test('24 hours', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*Сообщений за последние 24 часа:* user1 (23), user2 (11), user3 (7)');
    });
    const start24HourDate = 1591833600; // 11.06.2020 00:00
    const end24HourDate = 1591920000; // 12.06.2020 00:00
    const oneHour = 3600;
    const sendMessagesArray = [];

    // user1 sends message every hour
    for (
      let sendMessageDate = start24HourDate;
      sendMessageDate < end24HourDate;
      sendMessageDate += oneHour
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 1, firstName: 'user1', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    // user2 sends message every two hours
    for (
      let sendMessageDate = start24HourDate;
      sendMessageDate < end24HourDate;
      sendMessageDate += oneHour * 2
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 2, firstName: 'user2', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    // user3 sends message every three hours
    for (
      let sendMessageDate = start24HourDate;
      sendMessageDate < end24HourDate;
      sendMessageDate += oneHour * 3
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 3, firstName: 'user3', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    await Promise.all(sendMessagesArray);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: end24HourDate,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });

  test('one hour', async () => {
    const slimbot = createMockedSlimbot((chatId, text) => {
      expect(text).toMatch('*Сообщений за последний час:* user1 (59), user2 (5), user3 (2)');
    });

    const startHourDate = 1591833600; // 11.06.2020 00:00
    const endHourDate = 1591837200; // 11.06.2020 01:00
    const oneMinute = 60;
    const sendMessagesArray = [];

    // user1 sends message every minute
    for (
      let sendMessageDate = startHourDate;
      sendMessageDate < endHourDate;
      sendMessageDate += oneMinute
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 1, firstName: 'user1', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    // user2 sends message every ten minutes
    for (
      let sendMessageDate = startHourDate;
      sendMessageDate < endHourDate;
      sendMessageDate += oneMinute * 10
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 2, firstName: 'user2', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    // user3 sends message every twenty minutes
    for (
      let sendMessageDate = startHourDate;
      sendMessageDate < endHourDate;
      sendMessageDate += oneMinute * 20
    ) {
      sendMessagesArray.push(sendTestMessage({
        userId: 3, firstName: 'user3', date: sendMessageDate, type: 'text',
      }, onMessage, slimbot));
    }

    await Promise.all(sendMessagesArray);

    const statMessage = {
      chat: {
        id: 1,
      },
      date: endHourDate,
      text: '/stats',
      entities: [{ type: 'bot_command' }],
    };

    await onMessage(slimbot, statMessage);
  });
});
