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
      { $match: { 'chat.id': chat.id, date: { $gt: dayTimestamp }, text: /\?/ } },
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
  if (collectedStat.length === 0) {
    return '';
  }
  const topUser = collectedStat[0];

  const questions = ['вопрос', 'вопроса', 'вопросов'];
  const getQuestions = proschet(questions);
  return `*${getFullUserName(topUser)}* - Дудь (задал ${topUser.count} ${getQuestions(topUser.count)} за неделю)`;
};

module.exports = {
  render,
  collect,
};
