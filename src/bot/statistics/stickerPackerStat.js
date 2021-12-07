const proschet = require('proschet').default;
const { getFullUserName } = require('../utils/render');
const MetricsRepository = require('../../db/repositories/metrics');

const metricsRepository = new MetricsRepository();

const collect = async ({ chat, date }) => metricsRepository.getStickerPacker(chat.id, date);

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
  title: 'Стикерпакер',
  name: 'stickerpacker',
};
