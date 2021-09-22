const BaseRepository = require('../base');

const saveQuery = `INSERT INTO chats(tg_id, name)
       VALUES ($1, $2)
       ON CONFLICT (tg_id) DO UPDATE SET tg_id=EXCLUDED.tg_id
       RETURNING *`;

const getAllQuery = 'SELECT * FROM chats';

class ChatsRepository extends BaseRepository {
  async save(chat) {
    const values = [chat.tg_id, chat.name];
    const result = await this.client.query(saveQuery, values);
    return result.rows[0];
  }

  async getAll() {
    const result = await this.client.query(getAllQuery);
    return result.rows;
  }
}

module.exports = ChatsRepository;
