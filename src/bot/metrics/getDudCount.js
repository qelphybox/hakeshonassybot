const getDudCount = (text) => (/\?/.test(text) ? 1 : 0);

module.exports = getDudCount;
