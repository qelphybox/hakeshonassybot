const BaseRepository = require('../base');

const saveQuery = `INSERT INTO users_chats(chat_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, chat_id) DO UPDATE SET user_id=EXCLUDED.user_id
       RETURNING *`;

const getAllQuery = 'SELECT * FROM users_chats';

class UserChatsRepository extends BaseRepository {
  async save(userChat) {
    const values = [userChat.chat.id, userChat.user.id];
    const result = await this.client.query(saveQuery, values);
    return result.rows[0];
  }

  async getAll() {
    const result = await this.client.query(getAllQuery);
    return result.rows;
  }
}

module.exports = UserChatsRepository;
