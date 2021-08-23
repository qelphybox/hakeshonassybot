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

    const bot = createMockedSlimbot(jest.fn());

    await sendTestMessage({
      userId: 1, firstName: 'user1', date: 1591866060, type: 'text', title,
    }, onMessage, bot);
    const chats = await chatsRepository.getAll();
    console.log(chats);
    expect(chats[0]).toStrictEqual({ name: title });
    const users = await usersRepository.getAll();
    expect(users[0]).toStrictEqual({});
    const userChats = await userChatsRepository.getAll();
    expect(userChats[0]).toStrictEqual({});
  });
});
