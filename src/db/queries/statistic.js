const { dbClient } = require('../dbClientPg');

const getStatistic = async (chatId) => {
  const client = dbClient.getClient();
  const result = await client.query(
    `SELECT *
     FROM users_chats
              LEFT JOIN message_metrics
                        ON users_chats_id = users_chats.chat_id
              LEFT JOIN users
                        ON users.id = users_chats.user_id
     WHERE chat_id = $1`,
    [chatId],
  );
  return result.rows[0];
};

module.exports = { getStatistic };
