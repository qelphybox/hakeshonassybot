const { statsArray } = require('../statistics');
const { dbClient } = require('../dbClient');

const isCommand = ({ entities }) => !!entities && entities.some((entity) => entity.type === 'bot_command');

const renderMessage = (statsStringsArray) => statsStringsArray
  .filter((statString) => statString.length > 0)
  .join('\n');

const stats = async (slimbot, message) => {
  const statsText = await Promise.all(statsArray.map(async ({ render, collect }) => {
    const collection = await collect(message);
    return render(collection);
  }));

  const text = renderMessage(statsText);
  slimbot.sendMessage(
    message.chat.id,
    text,
    { disable_web_page_preview: true, parse_mode: 'Markdown' },
  );
};

const onMessage = async (slimbot, message) => {
  if (isCommand(message)) {
    if (message.text.startsWith('/stats')) {
      stats(slimbot, message);
    }
  } else {
    dbClient.queryMessages((messages) => {
      messages.insertOne(message);
    });
  }
};


module.exports = { onMessage };
