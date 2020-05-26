const moment = require('moment');
const { dbClient } = require('../dbClient');
const { getFullUserName } = require('../utils/render');

moment.locale('ru');

const collect = async ({ chat, date }) => {
  const queryDate = new Date(date * 1000);
  const currentWeekMonday = moment(queryDate).weekday(0);
  const dayTimestamp = currentWeekMonday / 1000;
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chat.id, date: { $gt: dayTimestamp } } },
      {
        $project: {
          _id: 1,
          'from.id': 1,
          'from.username': 1,
          'from.first_name': 1,
          'from.last_name': 1,
          dayOfWeek: {
            $dayOfWeek: {
              $toDate: { $multiply: ['$date', 1000] },
            },
          },
          hour: { $hour: { $toDate: { $multiply: ['$date', 1000] } } },
        },
      },
      {
        $match: {
          $expr: {
            $in: ['$dayOfWeek', [2, 3, 4, 5, 6]],
          },
        },
      },
      { $match: { $expr: { $and: [{ $gte: ['$hour', 10] }, { $lt: ['$hour', 18] }] } } },
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
    return `${getFullUserName(collectedStat[0])} - безработный`;
  }
  return '';
};

module.exports = {
  render,
  collect,
};
