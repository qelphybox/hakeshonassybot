const { MongoClient } = require('mongodb');

class DBClient {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName;
    this.client = new MongoClient(this.url);
  }

  connect() {
    return this.client.connect();
  }

  close() {
    return this.client.close();
  }

  get db() {
    return this.client.db(this.dbName);
  }

  query(callback) {
    return callback(this.db);
  }

  queryMessages(callback) {
    return this.query((db) => callback(db.collection('messages')));
  }
}

const dbClient = new DBClient(
  process.env.MONGO_URL,
  process.env.MONGO_DB_NAME,
);

Object.freeze(dbClient);
module.exports = { dbClient };
