const MongoClient = require('mongodb').MongoClient;

module.exports = class DBClient {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName;
  }

  _mongo() {
    return new MongoClient(this.url);
  }

  async saveMessage(message) {
    const mongo = this._mongo();
    const client = await mongo.connect();
    await client
      .db(this.dbName)
      .collection('messages')
      .insertOne(message);
    await client.close();
  }

  async getMessagesCountByUserToday(chatId) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const timestamp = startOfDay / 1000;

    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('messages')
      .aggregate(
        [
          {$match: {"chat.id": chatId, "date": {$gt: timestamp}}},
          {
            $group: {
              _id: "$from.id",
              count: {$sum: 1},
              first_name: {"$first": "$from.first_name"},
              last_name: {"$first": "$from.last_name"},
            }
          }
        ]
      )
      .toArray();
  }
};
