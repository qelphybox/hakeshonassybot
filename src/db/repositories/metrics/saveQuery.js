module.exports = `
  INSERT INTO message_metrics(
    tg_id,
    timestamp,
    users_chats_id,
    photoCount,
    videoCount,
    questionCount,
    stickerSetName,
    textLength,
    voiceCount,
    lolReplyForUser
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  ON CONFLICT (tg_id) DO UPDATE SET tg_id=EXCLUDED.tg_id RETURNING *
`;
