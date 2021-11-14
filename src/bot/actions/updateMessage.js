const { fetchMessageMetrics } = require('../metrics');
const MetricsRepository = require('../../db/repositories/metrics');

const metricsRepository = new MetricsRepository();

module.exports = async (bot, editedMessage) => {
  const metrics = fetchMessageMetrics(editedMessage);
  await metricsRepository.update(metrics);
};
