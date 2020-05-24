const { dbClient } = require('../dbClient');
const { getFullUserName } = require('../utils/render');

const getMondayDate = (date) => {
  const mondayNumber = 1;
  const sundayNumber = 0;
  // sunday index is 0, if get sunday index, need convert to 7 value;
  const currentDay = date.getDay() === sundayNumber ? 7 : date.getDay();
  return date.getDate() - (currentDay - mondayNumber);
};

const collect = async ({ chat, date }) => {
  const queryDate = new Date(date * 1000);
  const mondayDate = getMondayDate(queryDate);
  queryDate.setDate(mondayDate);
  const dayTimestamp = queryDate / 1000;
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
