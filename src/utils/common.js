const isCommand = ({ entities }) => entities && entities.any((entity) => entity.type === 'bot_command');

module.exports = { isCommand };
