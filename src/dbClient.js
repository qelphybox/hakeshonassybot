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

  async getChatMessagesStatByDate(chatId, timestamp) {
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
              count: {"$sum": 1},
              username: {"$first": "$from.username"},
            }
          },
          { $sort : { count : -1 } }
        ]
      )
      .toArray();
  }

  async getWorklessUser(chatId, timestamp) {
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('messages')
      .aggregate(
        [
          {$match: {"chat.id": chatId, "date": {$gt: timestamp}}},
          {
            $match: {
              $expr: {
                $in: [{
                  $dayOfWeek: {
                    $toDate: {$multiply: ["$date", 1000]}
                  }
                }, [2, 3, 4, 5, 6]]
              }
            }
          },
          {$match: {$expr: {$and: [{$gt: [{$hour: {$toDate: {$multiply: ["$date", 1000]}}}, 10]}, {$lt: [{$hour: {$toDate: {$multiply: ["$date", 1000]}}}, 18]}]}}},
          {
            $group: {
              _id: "$from.id",
              count: {"$sum": 1},
              username: {"$first": "$from.username"},
            }
          },
          {$sort: {count: -1}},
          {$limit: 1}
        ]
      )
      .toArray();
  }
};
