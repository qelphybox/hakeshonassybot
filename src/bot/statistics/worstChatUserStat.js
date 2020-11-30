const proschet = require('proschet').default;
const { dbClient } = require('../../dbClient');
const { getFullUserName } = require('../utils/render');

const collect = async ({ chat }) => {
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chat.id, voice: { $exists: true } } },
      {
        $group: {
          _id: '$from.id',
          count: { $sum: 1 },
          username: { $first: '$from.username' },
          first_name: { $first: '$from.first_name' },
          last_name: { $first: '$from.last_name' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ],
  )
    .toArray());
  return data;
};

const render = (collectedStat) => {
  if (collectedStat.length > 0) {
    const topUser = collectedStat[0];

    const voices = ['голосовое', 'голосовых', 'голосовых'];
    const getVoices = proschet(voices);
    return `*${getFullUserName(topUser)}* - худший юзер чата (послал ${topUser.count} ${getVoices(topUser.count)})`;
  }
  return '';
};

module.exports = {
  render,
  collect,
};
