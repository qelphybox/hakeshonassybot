const MongoClient = require('mongodb').MongoClient;

module.exports = class DBClient {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName;
  }

  _mongo() {
    return new MongoClient(this.url);
  }

  saveMessage(message) {
    const mongo = this._mongo();
    mongo.connect()
      .then((client) => {
        client
          .db(this.dbName)
          .collection('messages')
          .insertOne(message)
          .then(() => client.close());
      })
  }
}

