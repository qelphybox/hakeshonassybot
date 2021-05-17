const moment = require('moment');
const proschet = require('proschet').default;
const { dbClient } = require('../../dbClient');
const { getFullUserName } = require('../utils/render');

moment.locale('ru');

const collect = async ({ chat, date }) => {
  const queryDate = new Date(date * 1000);
  const currentWeekMonday = moment(queryDate).subtract(7, 'days');
  const dayTimestamp = currentWeekMonday / 1000;
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      {
        $match: {
          'chat.id': chat.id,
          date: { $gt: dayTimestamp },
          reply_to_message: { $exists: true },
          $expr: { $ne: ['$from.id', '$reply_to_message.from.id'] },
          $or: [
            { text: /([^а-я]|^)(хах|кек|лол)([^а-я]|$)|ахах|хаха|азаз|ъаъ|]f]|hah|\[f\[|F}F|F{F/gim },
            { text: /😆|😅|🤣|😂|😸|😹|😀|😃|😄|😁/gm },
            { 'sticker.emoji': /😆|😅|🤣|😂|😸|😹|😀|😃|😄|😁/gm },
          ],
        },
      },
      {
        $group: {
          _id: '$reply_to_message.from.id',
          count: { $sum: 1 },
          username: { $first: '$reply_to_message.from.username' },
          first_name: { $first: '$reply_to_message.from.first_name' },
          last_name: { $first: '$reply_to_message.from.last_name' },
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
  if (collectedStat.length === 0) {
    return '';
  }
  const topUser = collectedStat[0];

  const reactions = ['кек', 'кека', 'кеков'];
  const getReaction = proschet(reactions);

  return `*${getFullUserName(topUser)}* - Юморист недели (${topUser.count} ${getReaction(topUser.count)})`;
};

module.exports = {
  render,
  collect,
};
