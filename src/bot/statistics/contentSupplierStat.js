const moment = require('moment');
const proschet = require('proschet').default;
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
      {
        $match: {
          'chat.id': chat.id,
          date: { $gt: dayTimestamp },
          $or: [
            { photo: { $exists: true } },
            { video: { $exists: true } },
            { $and: [{ text: { $in: [/.*youtu.be*/, /.*youtube.com*/] } }] }, // , { 'entities.type.0': 'url' }
            { $and: [{ text: { $in: [/.*.jpg/, /.*.png/] } }] }, // , { 'entities.type.0': 'url' }
          ],
        },
      },
      {
        $project: {
          _id: 1,
          'from.id': 1,
          'from.username': 1,
          'from.first_name': 1,
          'from.last_name': 1,
          photo: 1,
          video: 1,
          text: 1,
          dayOfWeekOfMessageTimestamp: {
            $dayOfWeek: { date: { $toDate: { $multiply: ['$date', 1000] } }, timezone: '+03:00' },
          },
          hourOfMessageTimestamp: { $hour: { date: { $toDate: { $multiply: ['$date', 1000] } }, timezone: '+03:00' } },
        },
      },
      {
        $match: {
          $expr: {
            $in: ['$dayOfWeekOfMessageTimestamp', [2, 3, 4, 5, 6]],
          },
        },
      },
      { $match: { $expr: { $and: [{ $gte: ['$hourOfMessageTimestamp', 10] }, { $lt: ['$hourOfMessageTimestamp', 18] }] } } },
      {
        $group: {
          _id: '$from.id',
          count: { $sum: 1 },
          username: { $first: '$from.username' },
          first_name: { $first: '$from.first_name' },
          last_name: { $first: '$from.last_name' },
          photoCount: { $sum: { $cond: { if: { $or: ['$photo', { $regexMatch: { input: '$text', regex: /.*.jpg|.png/ } }] }, then: 1, else: 0 } } },
          videoCount: { $sum: { $cond: { if: { $or: ['$video', { $regexMatch: { input: '$text', regex: /.*youtube.com|youtu.be*/ } }] }, then: 1, else: 0 } } },
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

    const pictures = ['картинка', 'картинки', 'картинок'];
    const gePictures = proschet(pictures);

    return `*${getFullUserName(topUser)}* - поставщик контента (${topUser.photoCount} ${gePictures(topUser.photoCount)}, ${topUser.videoCount} видео)`;
  }
  return '';
};

module.exports = {
  render,
  collect,
};
