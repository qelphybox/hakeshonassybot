const { dbClient } = require('../../dbClientPg');

class BaseRepository {
  constructor() { this.client = dbClient.getClient(); }

  queryWithTransaction(func) {
    return async (...args) => {
      try {
        await this.client.query('BEGIN');
        await func(...args);
        await this.client.query('COMMIT');
      } catch (e) {
        await this.client.query('ROLLBACK');
      }
    };
  }
}

module.exports = BaseRepository;
