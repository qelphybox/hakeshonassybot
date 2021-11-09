const MetricsRepository = require('../../../db/repositories/metrics');
const { getUserStatString } = require('../../utils/render');

const metricsRepository = new MetricsRepository();

const collect = async ({ chat, date }) => metricsRepository.getHourCount(chat.id, date);
const render = (collectedStat) => `*Сообщений за последний час:* ${collectedStat.map(getUserStatString).join(', ')}`;

module.exports = {
  render,
  collect,
  title: 'Количество сообщений за час',
  name: 'messages_count_hour',
};
