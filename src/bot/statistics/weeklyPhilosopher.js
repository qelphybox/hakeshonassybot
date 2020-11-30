const moment = require('moment');
const { dbClient } = require('../../dbClient');
const { getFullUserName } = require('../utils/render');

moment.locale('ru');

const collect = async ({ chat, date }) => {
  const queryDate = new Date(date * 1000);
  const currentWeekMonday = moment(queryDate).subtract(7, 'days').set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
  });
  const dayTimestamp = currentWeekMonday / 1000;
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chat.id, text: { $exists: true } } },
      { $match: { date: { $gt: dayTimestamp } } },
      {
        $project: {
          _id: 1,
          'from.id': 1,
          'from.username': 1,
          'from.first_name': 1,
          'from.last_name': 1,
          text_length: { $strLenCP: '$text' },
        },
      },
      { $sort: { text_length: 1 } },
      {
        $group: {
          _id: '$from.id',
          count: { $sum: 1 },
          username: { $first: '$from.username' },
          first_name: { $first: '$from.first_name' },
          last_name: { $first: '$from.last_name' },
          all_msg_len_array: { $push: '$text_length' },
        },
      },
      { $addFields: { middle_index: { $floor: { $divide: ['$count', 2] } } } },
      { $addFields: { middle_index_less: { $subtract: ['$middle_index', 1] } } },
      {
        $addFields: {
          median: {
            $cond: {
              if: { $mod: ['$count', 2] },
              then: { $arrayElemAt: ['$all_msg_len_array', '$middle_index'] },
              else: {
                $divide:
                [
                  {
                    $sum: [
                      { $arrayElemAt: ['$all_msg_len_array', '$middle_index'] },
                      { $arrayElemAt: ['$all_msg_len_array', '$middle_index_less'] },
                    ],
                  }, 2,
                ],
              },
            },
          },
        },
      },
      { $sort: { median: -1, count: -1 } },
    ],
  )
    .toArray());
  if (data.length > 0) {
    const topMedian = data[0].median;
    const filteredDataByTopMedian = data.filter((col) => col.median === topMedian);
    return filteredDataByTopMedian;
  }
  return data;
};

const render = (collectedStat) => {
  if (collectedStat.length === 0) {
    return '';
  }
  const topMedian = collectedStat[0].median;
  if (collectedStat.length > 1) {
    const chatPhilosophers = collectedStat.map((col) => `${getFullUserName(col)}`).join(', ');
    return `*${chatPhilosophers}* - философы недели (медианная длина сообщений ${topMedian})`;
  }
  return `*${getFullUserName(collectedStat[0])}* - философ недели (медианная длина сообщений ${topMedian})`;
};
module.exports = {
  render,
  collect,
};
