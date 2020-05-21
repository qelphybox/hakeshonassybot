const { stats } = require('./stats');

/* eslint-disable camelcase */
const getUserLink = ({ first_name, last_name, _id }) => `[${first_name}${last_name ? ` ${last_name}` : ''}](tg://user?id=${_id})`;
const getUserStatString = ({
  first_name, last_name, count, _id,
}) => `${getUserLink({ first_name, last_name, _id })} (${count})`;
/* eslint-enable camelcase */

const templates = {
  [stats.TODAY_MESSAGE_COUNT]: (stat) => `Сообщений за последние 24 часа: ${stat.map(getUserStatString).join(', ')}`,
  [stats.HOUR_MESSAGE_COUNT]: (stat) => `Сообщений за последний час: ${stat.map(getUserStatString).join(', ')}`,
  [stats.WORKLESS_USER]: (stat) => {
    if (stat.length > 0) {
      return `${getUserLink(stat[0])} - безработный`;
    }
    return '';
  },
  [stats.WORST_CHAT_USER]: (stat) => {
    console.log(stat);
    if (stat.length > 0) {
      return `${getUserLink(stat[0])} - худший юзер чата`;
    }
    return '';
  },
};

const renderMessage = (statsArray) => statsArray.map((stat) => templates[stat.name](stat.data)).join('\n');

module.exports = { renderMessage, getUserStatString };
