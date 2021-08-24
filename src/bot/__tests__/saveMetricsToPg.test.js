const moment = require('moment');
const { onMessage } = require('../actions');
const { sendTestMessage, createMockedSlimbot } = require('./lib/sendMessageHelper');

const { describeDBSetupTeardown } = require('./lib/dbHelper');
const ChatsRepository = require('../../db/repositories/chats');
const UsersRepository = require('../../db/repositories/users');
const UserChatsRepository = require('../../db/repositories/user_chats');

const chatsRepository = new ChatsRepository();
const usersRepository = new UsersRepository();
const userChatsRepository = new UserChatsRepository();

describeDBSetupTeardown();
moment.locale('ru');

describe('save metrics', () => {
  test('should create chat, user and userChat', async () => {
    const title = 'chat_title';
    const chatId = 1;
    const firstName = 'user1';
    const userId = 2;

    const bot = createMockedSlimbot(jest.fn());

    await sendTestMessage({
      userId, firstName, date: 1591866060, type: 'text', title, chatId,
    }, onMessage, bot);
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
  });
});
