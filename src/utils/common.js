const isCommand = ({ entities }) => entities && entities.some((entity) => entity.type === 'bot_command');

module.exports = { isCommand };
