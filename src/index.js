const Slimbot = require('slimbot');
const { renderMessage } = require('./render');
const { statFunctions } = require('./stats');

const DBClient = require('./dbClient');


const buildProxySettings = () => {
  let socks5;
  if (process.env.SOCKS5_HOST || process.env.SOCKS5_PORT) {
    socks5 = {
      socksHost: process.env.SOCKS5_HOST,
      socksPort: process.env.SOCKS5_PORT,
    };
  }
  return socks5;
};
const slimbot = new Slimbot(process.env.TELEGRAM_BOT_TOKEN, buildProxySettings());

const client = new DBClient(
  process.env.MONGO_URL,
  process.env.MONGO_DB_NAME,
);


const stats = async (statsRequestObj) => {
  const sendStats = await Promise.all(
    Object.keys(statFunctions)
      .map((statFunctionName) => statFunctions[statFunctionName](statsRequestObj)),
  );

  const text = renderMessage(sendStats);
  slimbot.sendMessage(
    statsRequestObj.chatId,
    text,
    { disable_web_page_preview: true, disable_notification: true },
  );
};

// Register listeners
slimbot.on('message', async (message) => {
  if (message.text.startsWith('/stats')) {
    const chatId = message.chat.id;
    const messageTimestamp = message.date;
    stats({ chatId, messageTimestamp });
  } else {
    client.saveMessage(message);
  }
});

slimbot.startPolling();
