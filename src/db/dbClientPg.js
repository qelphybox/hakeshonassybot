const { Client } = require('pg');

class DBClient {
  constructor(url) {
    console.log(url);
    this.url = url;
    this.client = new Client({
      connectionString: url,
    });
  }

  connect() {
    return this.client.connect();
  }

  getClient() {
    return this.client;
  }

  close() {
    return this.client.end();
  }
}

const dbClient = new DBClient(
  process.env.DATABASE_URL,
);

Object.freeze(dbClient);
module.exports = { dbClient };
