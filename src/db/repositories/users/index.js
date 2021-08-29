const BaseRepository = require('../base');

const saveQuery = `INSERT INTO users(tg_id, first_name, last_name)
                   VALUES ($1, $2, $3)
                   ON CONFLICT (tg_id) DO UPDATE SET tg_id=EXCLUDED.tg_id
                   RETURNING *`;

const getAllQuery = 'SELECT * FROM users';

class UsersRepository extends BaseRepository {
  async save(user) {
    const values = [user.tg_id, user.first_name, user.last_name];
    const result = await this.client.query(saveQuery, values);
    return result.rows[0];
  }

  async getAll() {
    const result = await this.client.query(getAllQuery);
    return result.rows;
  }
}

module.exports = UsersRepository;
