const MetricsRepository = require('../../../db/repositories/metrics');
const { getUserStatString } = require('../../utils/render');

const metricsRepository = new MetricsRepository();

const collect = async ({ chat, date }) => metricsRepository.getDayCount(chat.id, date);
const render = (collectedStat) => `*Сообщений за последние 24 часа:* ${collectedStat.map(getUserStatString).join(', ')}`;

module.exports = {
  render,
  collect,
  title: 'Количество сообщений за день',
  name: 'messages_count_day',
};
