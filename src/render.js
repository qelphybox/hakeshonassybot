const { stats } = require('./stats');
const moment = require('moment');

const getUserStatString = (row) => `@${row.username} (${row.count})`;

const templates = {
  [stats.TODAY_MESSAGE_COUNT]: (stat) => `Сообщений за ${moment().format('DD.MM.YYYY')}: ${stat.map(getUserStatString).join(", ")}`,
  [stats.HOUR_MESSAGE_COUNT]: (stat) => `Сообщений за последний час: ${stat.map(getUserStatString).join(", ")}`,
};

const renderMessage = (statsArray) => {
  return statsArray.map((stat) => templates[stat.name](stat.data)).join('\n');
};

module.exports = { renderMessage };
