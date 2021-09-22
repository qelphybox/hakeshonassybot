const getLolReplyForUserCount = (replyToMessage, from, text, sticker) => {
  if (replyToMessage && from.id !== replyToMessage.from.id) {
    const emoji = /😆|😅|🤣|😂|😸|😹|😀|😃|😄|😁/gm;
    const ahahaExist = /([^а-я]|^)(хах|кек|лол)([^а-я]|$)|ахах|хаха|азаз|ъаъ|]f]|hah|\[f\[|F}F|F{F/gim.test(text);
    const emojiExist = emoji.test(text);
    const stickerExist = sticker && emoji.test(sticker.emoji);
    if (ahahaExist || emojiExist || stickerExist) return 1;
  }
  return 0;
};

module.exports = getLolReplyForUserCount;
