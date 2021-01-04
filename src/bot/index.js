const Slimbot = require('slimbot');

const { onMessage, onMessageEdit } = require('./actions');

const { dbClient } = require('../dbClient');

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

// Register listeners
slimbot.on('message', onMessage.bind(null, slimbot));

slimbot.on('edited_message', onMessageEdit.bind(null, slimbot));

dbClient.connect()
  .then(() => {
    slimbot.startPolling();
  })
  .catch((e) => {
    console.error('Database connection error', e);
  });

process.on('exit', async (code) => {
  console.log(`Exit with code ${code}, stopping...`);
  slimbot.stopPolling();
  await dbClient.disconnect();
  console.log('Bye!');
});
