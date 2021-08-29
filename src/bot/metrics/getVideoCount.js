const getVideoCount = (video, text) => ((video || /.*youtu.be*|.*youtube.com*/.test(text)) ? 1 : 0);

module.exports = getVideoCount;
