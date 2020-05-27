const todayMessageCountStat = require('./todayMessageCountStat');
const hourMessageCountStat = require('./hourMessageCountStat');
const worklessUserStat = require('./worklessUserStat');
const contentSupplierStat = require('./contentSupplierStat');
const worstChatUserStat = require('./worstChatUserStat');

const statsArray = [
  todayMessageCountStat,
  hourMessageCountStat,
  worklessUserStat,
  contentSupplierStat,
  worstChatUserStat,
];

// TODO: tests for this two functions
module.exports = {
  statsArray,
};
