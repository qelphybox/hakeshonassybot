const { fetchMessageMetrics } = require('../metrics');
const MetricsRepository = require('../../db/repositories/metrics');

const metricsRepository = new MetricsRepository();

module.exports = async (message) => {
  const metrics = fetchMessageMetrics(message);
  await metricsRepository.saveMessageMetricsTransaction(metrics);
};
