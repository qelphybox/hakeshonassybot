const getValues = (messageMetric, userChat) => [
  messageMetric.tg_id,
  new Date(), // FIXME: сохранять date из message
  userChat.id,
  messageMetric.photoCount,
  messageMetric.videoCount,
  messageMetric.questionCount,
  messageMetric.stickerSetName,
  messageMetric.textLength,
  messageMetric.voiceCount,
  messageMetric.lolReplyForUser,
];

const createMessageMetric = async (client, messageMetric, userChat) => {
  console.log(userChat);
  const result = await client.query(
    `INSERT INTO message_metrics(tg_id,
                                 timestamp,
                                 users_chats_id,
                                 photoCount,
                                 videoCount,
                                 questionCount,
                                 stickerSetName,
                                 textLength,
                                 voiceCount,
                                 lolReplyForUser)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (tg_id) DO NOTHING RETURNING *`,
    getValues(messageMetric, userChat),
  );
  console.log(result);
  return result.rows[0];
};

module.exports = { createMessageMetric };
