const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname'); // Example for postgres
//
// sequelize.authenticate()
//   .then(() => console.log('Connection has been established successfully.'))
//   .catch((error) => console.error('Unable to connect to the database:', error));

class DBClient {
  constructor(url) {
    this.url = url;
    this.client = new Sequelize(this.url);
  }

  connect() {
    return this.client.authenticate()
      .then(() => console.log('Connection has been established successfully.'))
      .catch((error) => console.error('Unable to connect to the database:', error));
  }

  close() {
    return this.client.close();
  }

  // get db() {
  //   return this.client.db(this.dbName);
  // }
  //
  // query(callback) {
  //   return callback(this.db);
  // }
  //
  // queryMessages(callback) {
  //   return this.query((db) => callback(db.collection('messages')));
  // }
}

const dbClient = new DBClient(
  process.env.PG_URL,
);

Object.freeze(dbClient);
console.log(dbClient);
module.exports = { dbClient };
