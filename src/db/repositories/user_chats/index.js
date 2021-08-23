const BaseRepository = require('../base');

class UserChatsRepository extends BaseRepository {
  async save(userChat) {
    const values = [userChat.chat.id, userChat.user.id];
    const result = await this.client.query(
      `INSERT INTO users_chats(chat_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, chat_id) DO UPDATE SET user_id=EXCLUDED.user_id
       RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  async getAll() {
    const result = await this.client.query('SELECT * FROM users_chats');
    return result.rows;
  }
}

module.exports = UserChatsRepository;
