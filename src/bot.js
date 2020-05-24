import { isCommand } from './utils/common';

const Slimbot = require('slimbot');
const { renderMessage } = require('./utils/render');
const { statsArray } = require('./statistics');

const { dbClient } = require('./dbClient');

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

const stats = async (message) => {
  const statsText = await Promise.all(statsArray.map(async ({ render, collect }) => {
    const collection = await collect(message);
    return render(collection);
  }));

  const text = renderMessage(statsText);
  slimbot.sendMessage(
    message.chat.id,
    text,
    { disable_web_page_preview: true, disable_notification: true, parse_mode: 'Markdown' },
  );
};

// Register listeners
slimbot.on('message', async (message) => {
  if (isCommand(message)) {
    if (message.text.startsWith('/stats')) {
      stats(message);
    }
  } else {
    dbClient.queryMessages((messages) => {
      messages.insertOne(message);
    });
  }
});

dbClient.connect().then(() => {
  slimbot.startPolling();
});

process.on('exit', async (code) => {
  console.log(`Exit with code ${code}, stopping...`);
  slimbot.stopPolling();
  await dbClient.disconnect();
  console.log('Bye!');
});
