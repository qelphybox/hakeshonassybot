const fs = require('fs');
const util = require('util');
const { statsArray } = require('../statistics');
const { dbClient } = require('../../dbClient');

const isCommand = ({ entities }) => !!entities && entities.some((entity) => entity.type === 'bot_command');

const renderMessage = (statsStringsArray) => statsStringsArray
  .filter((statString) => statString.length > 0)
  .join('\n');

const stats = async (bot, message) => {
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

const rickroll = async (bot, message) => {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const text = `[Самый сильный младенец купил бмв](${url})`;
  await bot.sendMessage(
    message.chat.id,
    text,
    { disable_web_page_preview: true, parse_mode: 'Markdown' },
  );
};

const readFile = util.promisify(fs.readFile);
const version = async (bot, message) => {
  const versionFilePath = `${__dirname}/../../../version.txt`;
  try {
    const text = await readFile(versionFilePath, 'utf8');
    await bot.sendMessage(message.chat.id, text);
  } catch (e) {
    console.error(e);
  }
};

const onMessage = async (bot, message) => {
  if (isCommand(message)) {
    if (message.text.startsWith('/stats')) {
      await stats(bot, message);
    }
    if (message.text.startsWith('/rickroll')) {
      await rickroll(bot, message);
    }
    if (message.text.startsWith('/version')) {
      await version(bot, message);
    }
  } else {
    await dbClient.queryMessages(async (messages) => {
      await messages.insertOne(message);
    });
  }
};

const onMessageEdit = async (bot, editedMessage) => {
  await dbClient.queryMessages(async (messages) => {
    await messages.updateOne(
      { message_id: editedMessage.message_id },
      { $set: editedMessage },
    );
  });
};

module.exports = { onMessage, onMessageEdit };
