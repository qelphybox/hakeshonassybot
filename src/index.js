const Slimbot = require('slimbot');
const DBClient = require('./dbClient');

const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);
const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);

// Register listeners
slimbot.on('message', async message => {
  if (message.text.startsWith('/stats')) {
    const chatId = message.chat.id;
    // count stats
    const messages = await client.getMessagesCountByUserToday(chatId);
    const text = messages.map(row => {
      const user = `${row.first_name} ${row.last_name}`;
      return `${user} => ${row.count}`
    }).join("\n");
    slimbot.sendMessage(chatId, text)
  } else {
    client.saveMessage(message);
  }


});

slimbot.startPolling();
