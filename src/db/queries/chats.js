const getValues = (chat) => [chat.tg_id, chat.name];
const { dbClient } = require('../dbClientPg');

const createChat = async (chat) => {
  const client = dbClient.getClient();
  const result = await client.query(
    `INSERT INTO chats(tg_id, name)
     VALUES ($1, $2)
     ON CONFLICT (tg_id) DO UPDATE SET tg_id=EXCLUDED.tg_id
     RETURNING *`,
    getValues(chat),
  );
  console.log(result);
  return result.rows[0];
};

module.exports = { createChat };
