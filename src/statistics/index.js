const todayMessageCountStat = require('./todayMessageCountStat');
const hourMessageCountStat = require('./hourMessageCountStat');
const worklessUserStat = require('./worklessUserStat');
const contentSupplierStat = require('./contentSupplierStat');
const worstChatUserStat = require('./worstChatUserStat');
const maybeDiedStat = require('./maybeDiedStat');
const stickerPackerStat = require('./stickerPackerStat');
const dudStat = require('./dudStat');
const chatPhilosopher = require('./weeklyPhilosopher');

const statsArray = [
  todayMessageCountStat,
  hourMessageCountStat,
  worklessUserStat,
  contentSupplierStat,
  worstChatUserStat,
  stickerPackerStat,
  maybeDiedStat,
  dudStat,
  chatPhilosopher,
];

// TODO: tests for this two functions
module.exports = {
  statsArray,
};
