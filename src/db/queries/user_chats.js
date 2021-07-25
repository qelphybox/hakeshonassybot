const getValues = (userChat) => [userChat.chat.id, userChat.user.id];

const createUserChat = async (client, userChat) => {
  const result = await client.query(
    'INSERT INTO users_chats(chat_id, user_id) VALUES($1, $2) RETURNING *',
    getValues(userChat),
  );
  console.log(result);
  return result.rows[0];
};

module.exports = { createUserChat };
