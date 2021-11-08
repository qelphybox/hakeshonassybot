const todayMessageCountStat = require('./todayMessageCountStat');
const hourMessageCountStat = require('./hourMessageCountStat');

const statsArray = [
  todayMessageCountStat,
  hourMessageCountStat,
];

module.exports = { statsArray };
