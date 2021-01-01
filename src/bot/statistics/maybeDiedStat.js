const moment = require('moment');
const proschet = require('proschet').default;
const { dbClient } = require('../../dbClient');
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

    const days = ['день', 'дня', 'дней'];
    const getDays = proschet(days);

    const today = moment();
    const lastMessageDate = moment(topUser.date * 1000);
    const diff = today.diff(lastMessageDate, 'days');
    const timeMessage = diff < 1 ? 'менее 1 дня' : `${diff} ${getDays(diff)}`;

    return `*${getFullUserName(topUser)}* - наверное помер (писал ${timeMessage} назад)`;
  }
  return '';
};

module.exports = {
  render,
  collect,
};
