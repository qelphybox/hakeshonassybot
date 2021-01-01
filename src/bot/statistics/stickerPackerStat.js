const proschet = require('proschet').default;
const { dbClient } = require('../../dbClient');
const { getFullUserName } = require('../utils/render');

const collect = async ({ chat }) => {
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chat.id, sticker: { $exists: true } } },
      {
        $group: {
          _id: {
            stickerPack: '$sticker.set_name',
            userID: '$from.id',
          },
          username: { $first: '$from.username' },
          first_name: { $first: '$from.first_name' },
          last_name: { $first: '$from.last_name' },
        },
      },
      {
        $group: {
          _id: '$_id.userID',
          count: { $sum: 1 },
          username: { $first: '$username' },
          first_name: { $first: '$first_name' },
          last_name: { $first: '$last_name' },
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

    const stickerpacks = ['стикерпак', 'стикерпака', 'стикерпаков'];
    const getStickerpacks = proschet(stickerpacks);

    return `*${getFullUserName(topUser)}* - стикерпакер (юзает ${topUser.count} ${getStickerpacks(topUser.count)})`;
  }
  return '';
};

module.exports = {
  render,
  collect,
};
