const { renderMessage } = require('./render');
const { statFunctions } = require('./stats');

const Slimbot = require('slimbot');
const { dbClient } = require('./dbClient');

const buildProxySettings = () => {
  if (process.env['SOCKS5_HOST'] || process.env['SOCKS5_PORT']) {
    return {
      socksHost: process.env['SOCKS5_HOST'],
      socksPort: process.env['SOCKS5_PORT'],
    }
  }
}

const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN'], buildProxySettings());

const stats = async (statsRequestObj) => {
  const sendStats = await Promise.all(
    Object.keys(statFunctions)
      .map((statFunctionName) => statFunctions[statFunctionName](statsRequestObj))
  );

  const text = renderMessage(sendStats);
  slimbot.sendMessage(statsRequestObj.chatId, text, { disable_web_page_preview: true, disable_notification: true });
};

// Register listeners
slimbot.on('message', async message => {
  if (message.text.startsWith('/stats')) {
    const chatId = message.chat.id;
    const messageTimestamp = message.date;
    stats({ chatId, messageTimestamp, dbClient });
  } else {
    dbClient.queryMessages((messages) => {
      messages.insertOne(message)
    }) ;
  }
});

dbClient.connect().then(() => {
  slimbot.startPolling();
})

process.on('exit', async (code) => {
  console.log(`Exit with code ${code}, stopping...`);
  await dbClient.disconnect();
  slimbot.stopPolling();
  console.log('Bye!');
})