const proschet = require('proschet').default;
const moment = require('moment');
const MetricsRepository = require('../../db/repositories/metrics');
const { getFullUserName } = require('../utils/render');

const metricsRepository = new MetricsRepository();

const collect = async ({ chat, date }) => {
  const queryDate = new Date(date * 1000);
  const currentWeekMonday = moment(queryDate).subtract(7, 'days').set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
  });
  const dayTimestamp = currentWeekMonday / 1000;
  return metricsRepository.getWorklessUser(chat.id, date, dayTimestamp);
};

const render = (collectedStat) => {
  if (collectedStat.length > 0) {
    const topUser = collectedStat[0];

    const messages = ['сообщение', 'сообщения', 'сообщений'];
    const getMessages = proschet(messages);

    return `*${getFullUserName(topUser)}* - безработный (${topUser.count} ${getMessages(topUser.count)} в рабочее время за неделю)`;
  }
  return '';
};

module.exports = {
  render,
  collect,
  title: 'Безработный',
  name: 'workless_user',
};
