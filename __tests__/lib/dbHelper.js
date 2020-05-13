const MongoClient = require('mongodb').MongoClient;

const url = process.env['MONGO_URL'];
const dbName = process.env['MONGO_DB_NAME'];

const getClient = async () => {
  const mongo = new MongoClient(url);
  return await mongo.connect();
}

const addMessages = async (messages) => {
  const client = await getClient();
  await client
    .db(dbName)
    .collection('messages')
    .insertMany(messages);
  await client.close();
};

const removeAllMessages = async () => {
  const client = await getClient();
  await client
    .db(dbName)
    .collection('messages')
    .deleteMany({});
  await client.close();

}

module.exports = { addMessages, removeAllMessages };
