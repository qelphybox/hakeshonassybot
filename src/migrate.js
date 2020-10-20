const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB_NAME;

const createDbCollection = async () => {
  const mongo = new MongoClient(url);
  const client = await mongo.connect();

  let messages = await client.db(dbName).collection('messages');
  if (!messages) {
    messages = await client.db(dbName).createCollection('messages');
  }
  await messages.createIndex({ 'chat.id': 1 });
  await messages.createIndex({ date: -1 });
};

console.log('Start migration...');
createDbCollection()
  .then(() => {
    console.log('Done');
    process.exit();
  })
  .catch((error) => {
    console.log('migration failed with error: ', error);
    process.exit(1);
  });
