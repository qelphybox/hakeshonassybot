const moment = require('moment');
const proschet = require('proschet').default;
const { getFullUserName } = require('../utils/render');
const MetricsRepository = require('../../db/repositories/metrics');

const metricsRepository = new MetricsRepository();

const collect = async ({ chat, date }) => {
  const queryDate = new Date(date * 1000);
  const currentWeekMonday = moment(queryDate).subtract(7, 'days').set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
  });
  const dayTimestamp = currentWeekMonday / 1000;
  return metricsRepository.getContentSupplier(chat.id, date, dayTimestamp);
};

const render = (collectedStat) => {
  if (collectedStat.length > 0) {
    console.log('collectedStat: ', collectedStat);
    const topUser = collectedStat[0];

    const pictures = ['картинка', 'картинки', 'картинок'];
    const gePictures = proschet(pictures);

    return `*${getFullUserName(topUser)}* - поставщик контента (${topUser.photocount} ${gePictures(topUser.photocount)}, ${topUser.videocount} видео)`;
  }
  return '';
};

module.exports = {
  render,
  collect,
  title: 'Поставщик контента',
  name: 'content_supplier',
};
