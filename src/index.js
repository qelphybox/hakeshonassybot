const { renderMessage } = require('./render');
const { statByDay, statByHour } = require('./stats');

const Slimbot = require('slimbot');
const DBClient = require('./dbClient');


const buildProxySettings = () => {
  if (process.env['SOCKS5_HOST'] || process.env['SOCKS5_PORT']) {
    return {
      socksHost: process.env['SOCKS5_HOST'],
      socksPort: process.env['SOCKS5_PORT'],
    }
  }
}
const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN'], buildProxySettings());

const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);


const stats = async (statsRequestObj) => {
  const statsFunctions = [statByDay, statByHour, worklessUser];
  const sendStats = await Promise.all(statsFunctions.map((statFunction) => statFunction(statsRequestObj)));

  const text = renderMessage(sendStats);
  slimbot.sendMessage(statsRequestObj.chatId, text, { disable_web_page_preview: true, disable_notification: true });
};

// Register listeners
slimbot.on('message', async message => {
  if (message.text.startsWith('/stats')) {
    const chatId = message.chat.id;
    const messageTimestamp = message.date;
    stats({ chatId, messageTimestamp });
  } else {
    client.saveMessage(message);
  }
});

slimbot.startPolling();
