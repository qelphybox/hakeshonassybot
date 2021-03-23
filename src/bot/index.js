const TelegramBot = require('node-telegram-bot-api');

const { onMessage, onMessageEdit } = require('./actions');

const { dbClient } = require('../dbClient');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// Register listeners
bot.on('message', onMessage.bind(null, bot));

bot.on('edited_message', onMessageEdit.bind(null, bot));

dbClient.connect()
  .then(() => {
    bot.startPolling();
  })
  .catch((e) => {
    console.error('Database connection error', e);
  });

process.on('exit', async (code) => {
  console.log(`Exit with code ${code}, stopping...`);
  bot.stopPolling();
  await dbClient.disconnect();
  console.log('Bye!');
});
