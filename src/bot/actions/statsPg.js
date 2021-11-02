// const dbClient = require('../../db/dbClientPg');

module.exports = async (bot, message) => {
  const text = '';
  bot.sendMessage(
    message.chat.id,
    text,
    { disable_web_page_preview: true, parse_mode: 'Markdown' },
  );
};
