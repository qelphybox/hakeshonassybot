const { dbClient } = require('../dbClientPg');

const getValues = (userChat) => [userChat.chat.id, userChat.user.id];

const createUserChat = async (userChat) => {
  const client = dbClient.getClient();
  const result = await client.query(
    `INSERT INTO users_chats(chat_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, chat_id) DO UPDATE SET user_id=EXCLUDED.user_id
     RETURNING *`,
    getValues(userChat),
  );
  return result.rows[0];
};

module.exports = { createUserChat };
