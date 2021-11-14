module.exports = `
  UPDATE message_metrics SET (
    timestamp,
    photoCount,
    videoCount,
    questionCount,
    stickerSetName,
    textLength,
    voiceCount,
    lolReplyForUser
  ) = (to_timestamp($2), $3, $4, $5, $6, $7, $8, $9)
  WHERE tg_id = $1
`;
