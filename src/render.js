const { stats } = require('./stats');

const getUserStatString = (row) => `@${row.username} (${row.count})`;

const templates = {
  [stats.TODAY_MESSAGE_COUNT]: (stat) => `Сообщений за последние 24 часа: ${stat.map(getUserStatString).join(", ")}`,
  [stats.HOUR_MESSAGE_COUNT]: (stat) => `Сообщений за последний час: ${stat.map(getUserStatString).join(", ")}`,
};

const renderMessage = (statsArray) => {
  return statsArray.map((stat) => templates[stat.name](stat.data)).join('\n');
};

module.exports = { renderMessage, getUserStatString };
