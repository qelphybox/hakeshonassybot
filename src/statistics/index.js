const todayMessageCountStat = require('./todayMessageCountStat');
const hourMessageCountStat = require('./hourMessageCountStat');
const worklessUserStat = require('./worklessUserStat');
const contentSupplierStat = require('./contentSupplierStat');
const worstChatUserStat = require('./worstChatUserStat');
const stickerPackerStat = require('./stickerPackerStat');

const statsArray = [
  todayMessageCountStat,
  hourMessageCountStat,
  worklessUserStat,
  contentSupplierStat,
  worstChatUserStat,
  stickerPackerStat,
];

// TODO: tests for this two functions
module.exports = {
  statsArray,
};
