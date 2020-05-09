const { renderMessage } = require('./render');
const { statByDay, statByHour } = require('./stats');

const Slimbot = require('slimbot');
const DBClient = require('./dbClient');


const socks5proxy = {
  socksHost: process.env['SOCKS5_HOST'],
  socksPort: process.env['SOCKS5_PORT'],
};

let slimbot;

if (process.env['USE_PROXY'] === 'true') {
  slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN'], socks5proxy);
} else {
  slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);
}

const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);


const stats = async (chatId) => {
  const statsFunctions = [statByDay, statByHour];
  const sendStats = await Promise.all(statsFunctions.map((statFunction) => statFunction(chatId)));

  const text = renderMessage(sendStats);
  slimbot.sendMessage(chatId, text, { disable_web_page_preview: true, disable_notification: true });
};

// Register listeners
slimbot.on('message', message => {
  if (message.text.startsWith('/stats')) {
    const chatId = message.chat.id;
    stats(chatId);
  } else {
    client.saveMessage(message);
  }
});

slimbot.startPolling();
