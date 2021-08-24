INSERT INTO users_chats(chat_id, user_id)
VALUES ($1, $2)
ON CONFLICT (user_id, chat_id) DO UPDATE SET user_id=EXCLUDED.user_id
RETURNING *
