const { MongoClient } = require('mongodb');

module.exports = class DBClient {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName;
  }

  mongo() {
    return new MongoClient(this.url);
  }

  async saveMessage(message) {
    const mongo = this.mongo();
    const client = await mongo.connect();
    await client
      .db(this.dbName)
      .collection('messages')
      .insertOne(message);
    await client.close();
  }

  async getChatMessagesStatByDate(chatId, timestamp) {
    const mongo = this.mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('messages')
      .aggregate(
        [
          { $match: { 'chat.id': chatId, date: { $gt: timestamp } } },
          {
            $group: {
              _id: '$from.id',
              count: { $sum: 1 },
              username: { $first: '$from.username' },
              first_name: { $first: '$from.first_name' },
              last_name: { $first: '$from.last_name' },
            },
          },
          { $sort: { count: -1 } },
        ],
      )
      .toArray();
  }

  async getWorklessUser(chatId, timestamp) {
    const mongo = this.mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('messages')
      .aggregate(
        [
          { $match: { 'chat.id': chatId, date: { $gt: timestamp } } },
          {
            $project: {
              _id: 1,
              'from.id': 1,
              'from.username': 1,
              'from.first_name': 1,
              'from.last_name': 1,
              dayOfWeekOfMessageTimestamp: {
                $dayOfWeek: { date: { $toDate: { $multiply: ['$date', 1000] } }, timezone: '+03:00' },
              },
              hourOfMessageTimestamp: { $hour: { date: { $toDate: { $multiply: ['$date', 1000] } }, timezone: '+03:00' } },
            },
          },
          {
            $match: {
              $expr: {
                $in: ['$dayOfWeekOfMessageTimestamp', [2, 3, 4, 5, 6]],
              },
            },
          },
          { $match: { $expr: { $and: [{ $gte: ['$hourOfMessageTimestamp', 10] }, { $lt: ['$hourOfMessageTimestamp', 18] }] } } },
          {
            $group: {
              _id: '$from.id',
              count: { $sum: 1 },
              username: { $first: '$from.username' },
              first_name: { $first: '$from.first_name' },
              last_name: { $first: '$from.last_name' },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ],
      )
      .toArray();
  }
};
