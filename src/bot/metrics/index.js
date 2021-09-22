const getPhotoCount = require('./getPhotoCount');
const getVideoCount = require('./getVideoCount');
const getDudCount = require('./getDudCount');
const getStickySetName = require('./getStickySetName');
const getTextLength = require('./getTextLength');
const getLolReplyForUserCount = require('./getLolReplyForUserCount');
const getVoiceCount = require('./getVoiceCount');

const fetchMessageMetrics = ({
  from,
  chat,
  message_id: messageId,
  date,
  photo,
  video,
  text,
  sticker,
  voice,
  reply_to_message: replyToMessage,
}) => ({
  user: {
    tg_id: from.id,
    first_name: from.first_name,
    last_name: from.last_name,
  },
  chat: {
    tg_id: chat.id,
    name: chat.title,
  },
  messageMetrics: {
    tg_id: messageId,
    timestamp: date,
    photoCount: getPhotoCount(photo, text),
    videoCount: getVideoCount(video, text),
    questionCount: getDudCount(text),
    stickerSetName: getStickySetName(sticker),
    textLength: getTextLength(text),
    voiceCount: getVoiceCount(voice),
    lolReplyForUser: getLolReplyForUserCount(replyToMessage, from, text, sticker),
  },
});

module.exports = { fetchMessageMetrics };
