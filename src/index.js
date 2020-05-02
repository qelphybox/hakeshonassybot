const Slimbot = require('slimbot');
const DBClient = require('./dbClient');
const moment = require('moment');


const socks5proxy = {
  socksHost: process.env['SOCKS5_HOST'], //required
  socksPort: process.env['SOCKS5_PORT'], //required
};
const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN'], socks5proxy);

const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);

// Register listeners
slimbot.on('message', async message => {
  if (message.text.startsWith('/stats')) {
    const chatId = message.chat.id;
    const chat = await client.getChat(chatId);
    // todo: в общей статистике есть только id пользователя, за всей статистикой надо все равно лезть в юзеров
    const text = `Сообщений за ${moment().format('DD.MM.YYYY')} : ${
      chat.messages_count.map(row => {
        const user = chat.users.find((user) => user.id === row.user_id);
        return `${user.first_name} ${user.last_name} (${row.count})`
      }).join("\n")
    }`;
    slimbot.sendMessage(chatId, text)
  } else if (message.text.startsWith('/mupd')) {
    const chatId = message.chat.id;

    const achieves = await client.getAchieve(chatId, 'mupd');

    const text = `${achieves[0].achieveName}: ${achieves[0].first_name} ${achieves[0].last_name}`
    slimbot.sendMessage(chatId, text);
  } else {
    message.used = false;
    client.saveMessage(message);
  }
});

slimbot.startPolling();
