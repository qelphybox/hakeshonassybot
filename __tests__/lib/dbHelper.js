const MongoClient = require('mongodb').MongoClient;

const url = process.env['MONGO_URL'];
const dbName = process.env['MONGO_DB_NAME'];
const createDbCollection = async () => {
  const mongo = new MongoClient(url);
  const client = await mongo.connect();

  await client.db(dbName).createCollection('messages');
};

const addMessages = async (messages) => {
  const mongo = new MongoClient(url);
  const client = await mongo.connect();
  await client
    .db(dbName)
    .collection('messages')
    .insertMany(messages);
  await client.close();
};

const removeAllMessages = async () => {
  const mongo = new MongoClient(url);
  const client = await mongo.connect();
  await client
    .db(dbName)
    .collection('messages')
    .deleteMany({});
  await client.close();

}

module.exports = { createDbCollection, addMessages, removeAllMessages };
