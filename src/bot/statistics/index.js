const todayMessageCountStat = require('./todayMessageCountStat');
const hourMessageCountStat = require('./hourMessageCountStat');
const worklessUserStat = require('./worklessUserStat');

const statsArray = [
  todayMessageCountStat,
  hourMessageCountStat,
  worklessUserStat,
];

module.exports = { statsArray };
