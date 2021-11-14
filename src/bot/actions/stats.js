const { statsArray } = require('../statistics/pg');

const renderMessage = (statsStringsArray) => statsStringsArray
  .filter((statString) => statString.length > 0)
  .join('\n');

module.exports = async (bot, message) => {
  const statsText = await Promise.all(statsArray.map(async ({ render, collect }) => {
    const collection = await collect(message);
    return render(collection);
  }));

  const text = renderMessage(statsText);
  bot.sendMessage(
    message.chat.id,
    text,
    { disable_web_page_preview: true, parse_mode: 'Markdown' },
  );
};
