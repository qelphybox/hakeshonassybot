const { Client } = require('pg');
// const { Client } = require('pg')
// const client = new Client()
// await client.connect()
// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
// console.log(res.rows[0].message) // Hello world!
// await client.end()
// pools will use environment variables
// for connection information
// const pool = new Pool()
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

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
console.log(dbClient);
module.exports = { dbClient };
