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
      await stats(slimbot, message);
    }
  } else {
    await dbClient.queryMessages(async (messages) => {
      await messages.insertOne(message);
    });
  }
};

const onMessage2 = async (slimbot, message) => {
  if (isCommand(message)) {
    if (message.text.startsWith('/rick')) {
      await rick(slimbot, message);
    }
  } else {
    await dbClient.queryMessages(async (messages) => {
      await messages.insertOne(message);
    });
  }
};

const rick = async (slimbot, message) => {
  const text = renderMessage('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  await slimbot.sendMessage(
    message.chat.id,
    text,
    { disable_web_page_preview: true, parse_mode: 'Markdown' },
  );
};

module.exports = { onMessage, onMessage2 };
