const storeMessage = require('./storeMessage');
const rickroll = require('./rickroll');
const stats = require('./stats');
const version = require('./version');
const updateMessage = require('./updateMessage');

const isCommand = ({ entities }) => !!entities && entities.some((entity) => entity.type === 'bot_command');

const commandHandlers = {
  '/stats': stats,
  '/rickroll': rickroll,
  '/version': version,
};

// eslint-disable-next-line consistent-return
const handleCommand = (bot, message) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const command in commandHandlers) {
    if (message.text.startsWith(command)) {
      const handler = commandHandlers[command];
      return handler(bot, message);
    }
  }
};

const onMessage = async (bot, message) => {
  console.log('new message: ', message);
  if (isCommand(message)) {
    await handleCommand(bot, message);
  } else {
    await storeMessage(message);
  }
};

module.exports = { onMessage, onMessageEdit: updateMessage };
