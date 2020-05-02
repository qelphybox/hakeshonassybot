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

  async saveAchieve(achieve) {
    const mongo = this._mongo();
    const client = await mongo.connect();
    await client
      .db(this.dbName)
      .collection('achieves')
      .updateOne(
        { "_id": achieve._id },
        { $set: achieve },
        { upsert :true }
        );
    await client.close();
  }

  async getAllTodayChats() {
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
          {$match: {"date": {$gt: timestamp}}},
          {
            $group: {
              _id: "$chat.id",
              title: {"$first": "$chat.title"},
              type: {"$first": "$chat.type"},
            }
          }
        ]
      )
      .toArray();
  }

  async getAchieve(chatId, achieveId) {
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('achieves')
      .findOne({"chatId": chatId, "achieveId": achieveId});
  }

  async getUnusedMessages() {
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('messages')
      .find({'used': {$ne: true}})
      .toArray();
  }

  async getChat(chatId) {
    console.log('getChat:: ', chatId);
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('chats')
      .findOne({'_id': chatId});
  }

  async saveChat(chat) {
    console.log('saveChat', chat)
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('chats')
      .updateOne(
        { "_id": chat._id },
        { $set: chat },
        { upsert :true }
      );
  }

  async setMessageUsed(messageId) {
    console.log(messageId);
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('messages')
      .updateOne(
        { "_id": messageId },
        { $set: { "used": true } }
      );
  }
};
