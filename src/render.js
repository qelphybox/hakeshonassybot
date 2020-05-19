const { stats } = require('./stats');

const getUserStatString = ({
/* eslint-disable camelcase */
  first_name, last_name, count, _id,
}) => `[${first_name}${last_name ? ` ${last_name}` : ''}](tg://user?id=${_id}) (${count})`;
/* eslint-enable camelcase */

const templates = {
  [stats.TODAY_MESSAGE_COUNT]: (stat) => `Сообщений за последние 24 часа: ${stat.map(getUserStatString).join(', ')}`,
  [stats.HOUR_MESSAGE_COUNT]: (stat) => `Сообщений за последний час: ${stat.map(getUserStatString).join(', ')}`,
  [stats.WORKLESS_USER]: (stat) => {
    if (stat.length > 0) {
      return `@${stat[0].username} - безработный`;
    }
    return '';
  },
};

const renderMessage = (statsArray) => statsArray.map((stat) => templates[stat.name](stat.data)).join('\n');

module.exports = { renderMessage, getUserStatString };
