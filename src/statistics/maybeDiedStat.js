const moment = require('moment');
const { dbClient } = require('../dbClient');
const { getFullUserName } = require('../utils/render');

const collect = async ({ chat }) => {
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chat.id } },
      {
        $group: {
          _id: '$from.id',
          date: { $max: '$date' },
          username: { $first: '$from.username' },
          first_name: { $first: '$from.first_name' },
          last_name: { $first: '$from.last_name' },
        },
      },
      { $sort: { date: 1 } },
      { $limit: 1 },
    ],
  )
    .toArray());
  return data;
};

const render = (collectedStat) => {
  if (collectedStat.length > 0) {
    const topUser = collectedStat[0];

    const today = moment();
    const lastMessageDate = moment(topUser.date * 1000);
    const diff = today.diff(lastMessageDate, 'days');
    return `*${getFullUserName(topUser)}* - наверное помер (писал ${diff || 1} дня назад)`;
  }
  return '';
};

module.exports = {
  render,
  collect,
};
