const BaseRepository = require('../base');

class ChatsRepository extends BaseRepository {
  async save(chat) {
    const values = [chat.tg_id, chat.name];
    const result = await this.client.query(
      `INSERT INTO chats(tg_id, name)
       VALUES ($1, $2)
       ON CONFLICT (tg_id) DO UPDATE SET tg_id=EXCLUDED.tg_id
       RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  async getAll() {
    const result = await this.client.query('SELECT * FROM chats');
    return result.rows;
  }
}

module.exports = ChatsRepository;
