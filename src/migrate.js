const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB_NAME;

const createDbCollection = async () => {
  const mongo = new MongoClient(url);
  const client = await mongo.connect();

  await client.db(dbName).createCollection('messages');

  await client
    .db(dbName)
    .collection('messages')
    .createIndex({ 'chat.id': 1 });

  await client
    .db(dbName)
    .collection('messages')
    .createIndex({ date: -1 });
};

console.log('Start migration...');
createDbCollection();
console.log('Done');

process.exit();
