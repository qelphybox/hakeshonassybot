const todayMessageCountStat = require('./todayMessageCountStat');
const hourMessageCountStat = require('./hourMessageCountStat');
const worklessUserStat = require('./worklessUserStat');
const contentSupplierStat = require('./contentSupplierStat');

const statsArray = [
  todayMessageCountStat,
  hourMessageCountStat,
  worklessUserStat,
  contentSupplierStat,
];

module.exports = { statsArray };
