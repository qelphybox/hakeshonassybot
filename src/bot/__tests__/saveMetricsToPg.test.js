const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot, sendTestReplyMessage } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const ChatsRepository = require('../../db/repositories/chats');
const UsersRepository = require('../../db/repositories/users');
const UserChatsRepository = require('../../db/repositories/user_chats');
const MetricsRepository = require('../../db/repositories/metrics');

const chatsRepository = new ChatsRepository();
const usersRepository = new UsersRepository();
const userChatsRepository = new UserChatsRepository();
const metricsRepository = new MetricsRepository();

describeDBSetupTeardown();
moment.locale('ru');

describe('save metrics', () => {
  const messageId = 3;

  const defaultExpectedMetric = {
    id: expect.any(Number),
    lolreplyforuser: 0,
    photocount: 0,
    questioncount: 0,
    stickersetname: '',
    textlength: 0,
    tg_id: messageId,
    timestamp: expect.any(Date),
    users_chats_id: expect.any(Number),
    videocount: 0,
    voicecount: 0,
  };
  test('should create chat, user, userChat and text length metric', async () => {
    const title = 'chat_title';
    const chatId = 1;
    const firstName = 'user1';
    const userId = 2;
    const text = 'Test message to bot';

    const bot = createMockedSlimbot(jest.fn());

    await sendTestMessage({
      userId, firstName, date: 1591866060, type: 'text', title, chatId, messageId,
    }, onMessage, bot, text);
    const chats = await chatsRepository.getAll();
    expect(chats[0]).toStrictEqual({ id: expect.any(Number), name: title, tg_id: chatId });
    const users = await usersRepository.getAll();
    expect(users[0]).toStrictEqual({
      id: expect.any(Number), first_name: firstName, last_name: null, tg_id: userId,
    });
    const userChats = await userChatsRepository.getAll();
    expect(userChats[0]).toStrictEqual({
      id: expect.any(Number), chat_id: chats[0].id, user_id: users[0].id,
    });

    const metrics = await metricsRepository.getAll();
    expect(metrics[0]).toStrictEqual(
      { ...defaultExpectedMetric, textlength: text.length, users_chats_id: userChats[0].id },
    );
  });

  test('should create photo count 1 metric', async () => {
    const bot = createMockedSlimbot(jest.fn());

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'photo', messageId,
    }, onMessage, bot);

    const metrics = await metricsRepository.getAll();
    expect(metrics[0]).toStrictEqual({ ...defaultExpectedMetric, photocount: 1 });
  });

  test('should create video count 1 metric', async () => {
    const bot = createMockedSlimbot(jest.fn());

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'video', messageId,
    }, onMessage, bot);

    const metrics = await metricsRepository.getAll();
    expect(metrics[0]).toStrictEqual({ ...defaultExpectedMetric, videocount: 1 });
  });

  test('should create voice count 1 metric', async () => {
    const bot = createMockedSlimbot(jest.fn());

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'voice', messageId,
    }, onMessage, bot);

    const metrics = await metricsRepository.getAll();
    expect(metrics[0]).toStrictEqual({ ...defaultExpectedMetric, voicecount: 1 });
  });

  test('should create stickersetname metric', async () => {
    const stickersetname = 'Pojelaniepchelki';
    const bot = createMockedSlimbot(jest.fn());

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'sticker', messageId,
    }, onMessage, bot, { setName: stickersetname });

    const metrics = await metricsRepository.getAll();
    expect(metrics[0]).toStrictEqual({ ...defaultExpectedMetric, stickersetname });
  });

  test('should create questioncount metric', async () => {
    const text = 'Как дела?';
    const bot = createMockedSlimbot(jest.fn());

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591786800, type: 'text', messageId,
    }, onMessage, bot, text);

    const metrics = await metricsRepository.getAll();
    expect(metrics[0]).toStrictEqual(
      { ...defaultExpectedMetric, questioncount: 1, textlength: text.length },
    );
  });

  test('should create lolreplyforuser metric', async () => {
    const messageForReply = {
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

    const text = 'кек';
    const bot = createMockedSlimbot(jest.fn());

    await sendTestReplyMessage({
      userId: 2, firstName: 'user2', date: 1591790400, type: 'text', messageForReply, messageId,
    }, onMessage, bot, text);

    const metrics = await metricsRepository.getAll();
    expect(metrics[0]).toStrictEqual(
      { ...defaultExpectedMetric, lolreplyforuser: 1, textlength: text.length },
    );
  });
});
