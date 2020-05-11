const { stats } = require('./stats');

const getUserStatString = (row) => `@${row.username} (${row.count})`;

const templates = {
  [stats.TODAY_MESSAGE_COUNT]: (stat) => `Сообщений за последние 24 часа: ${stat.map(getUserStatString).join(", ")}`,
  [stats.HOUR_MESSAGE_COUNT]: (stat) => `Сообщений за последний час: ${stat.map(getUserStatString).join(", ")}`,
  [stats.WORKLESS_USER]: (stat) => {
    if (stat.length > 0)  {
      return `@${stat[0].username} - безработный`
    } else {
      return ''
    }
  },
};

const renderMessage = (statsArray) => {
  return statsArray.map((stat) => templates[stat.name](stat.data)).join('\n');
};

module.exports = { renderMessage, getUserStatString };
