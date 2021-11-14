const TelegramBot = require('node-telegram-bot-api');

const { onMessage, onMessageEdit } = require('./actions');

const { dbClient: dbClientPg } = require('../db/dbClientPg');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// Register listeners
bot.on('message', onMessage.bind(null, bot));

bot.on('edited_message', onMessageEdit.bind(null, bot));

dbClientPg.connect()
  .then(() => {
    bot.startPolling();
  })
  .catch((e) => {
    console.error('Database connection error', e);
  });

process.on('exit', async (code) => {
  console.log(`Exit with code ${code}, stopping...`);
  bot.stopPolling();
  await dbClientPg.close();
  console.log('Bye!');
});
