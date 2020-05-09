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

  async getMessagesStatByDate(timestamp) {
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('messages')
      .aggregate(
        [
          {$match: { "date": {$gt: timestamp}}},
          {
            $group: {
              _id: {
                "chat_id": "$chat.id",
                "user_id": "$from.id",
              },
              count: {"$sum": 1},
              first_name: {"$first": "$from.first_name"},
              last_name: {"$first": "$from.last_name"},
            }
          },
          {
            $group: {
              _id: "$_id.chat_id",
              stats: {
                $push: {
                  id: "$_id.user_id",
                  count: "$count",
                  first_name: "$first_name",
                  last_name: "$last_name",
                }
              }
            }
          }
        ]
      )
      .toArray();
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

  async getAllChats() {
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('chats')
      .find()
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

  async getChat(chatId) {
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('chats')
      .findOne({'_id': chatId});
  }

  async saveChat(chat) {
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('chats')
      .updateOne(
        {"_id": chat._id},
        {$set: chat},
        {upsert: true}
      );
  }

  async resetChatStat(chatId, statType) {
    const mongo = this._mongo();
    const client = await mongo.connect();
    return client
      .db(this.dbName)
      .collection('chats')
      .updateOne(
        {"_id": chatId},
        {$set: {[statType]: []}},
      );
  }
};
