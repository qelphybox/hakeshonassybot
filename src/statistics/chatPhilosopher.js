const { dbClient } = require('../dbClient');
const { getFullUserName } = require('../utils/render');

const collect = async ({ chat }) => {
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chat.id, text: { $exists: true } } },
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
  return data;
};

const render = (collectedStat) => {
  if (collectedStat.length > 0) {
    const topUser = collectedStat[0];
    const topMedian = topUser.median;
    const filteredByTopMedian = collectedStat.filter((col) => col.median === topMedian);
    if (filteredByTopMedian.length === 1) {
      return `*${getFullUserName(topUser)}* - философ чата (медианная длина сообщений ${topMedian})`;
    }
    if (filteredByTopMedian.length > 1) {
      const chatPhilosophers = filteredByTopMedian.map((col) => `${getFullUserName(col)}`).join(', ');
      return `*${chatPhilosophers}* - философы чата (медианная длина сообщений ${topMedian})`;
    }
  }
  return '';
};
module.exports = {
  render,
  collect,
};
