const DBClient = require('./dbClient');

const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);

const worker = async () => {
  console.log('workers run');

  const unusedMessages = await client.getUnusedMessages();

  console.log(unusedMessages);
  for (const message of unusedMessages) {
    const chatId = message.chat.id;

    let chat = await client.getChat(chatId);
    if (!chat) {
      chat = {
        _id: message.chat.id,
        ...message.chat,
        users: [{ ...message.from, count: 1 }],
        messages_count: [{ user_id: message.from.id, count: 1 }]
      };
    } else {
      let currentUser = chat.users.find((user) => user.id === message.from.id);
      if (!currentUser) {
        currentUser = {
          ...message.from,
          count: 1,
        };
        chat.users.push(currentUser);
      } else {
        currentUser.count += 1;
      }
      let messagesCountUser = chat.messages_count.find((user) => user.user_id === message.from.id);
      if (!messagesCountUser) {
        messagesCountUser = {
          user_id: message.from.id,
          count: 1,
        };
        chat.messages_count.push(messagesCountUser);
      } else {
        messagesCountUser.count += 1;
      }
    }

    await client.saveChat(chat);

    await client.setMessageUsed(message._id);
    /*
    1. Ищем чат
      1.1 Если чата нет, создаем его
      1.2 Если чат есть, берем его
    2. Находим пользователя в чате
      2.1 Если пользователя нет, создаем его
      2.2 Если пользователь есть увеличиваем счетчик
    3. Обновляем статистику по пользователю
    4. Сохраняем чат
     */
  }
};

const runWorker = () => worker().then(() => setTimeout(runWorker, 20000));

runWorker();


/*
const chats = await client.getAllTodayChats();

  for (const chat of chats) {
    const users = await client.getMessagesCountByUserToday(chat._id);
    const mostUserPerDay = users.reduce((acc, user) => acc.count > user.count ? acc : user, users[0]);

    mostUserPerDay.achieveId = 'mupd';
    mostUserPerDay.achieveName = 'Most user per day';
    mostUserPerDay.chatId = chat._id;
    mostUserPerDay._id = `${chat._id}_${mostUserPerDay.achieveId}`;

    await client.saveAchieve(mostUserPerDay);
  }
 */
