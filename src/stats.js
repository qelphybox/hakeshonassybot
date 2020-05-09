const DBClient = require('./dbClient');


const stats = {
  TODAY_MESSAGE_COUNT: 'today_message_count',
  HOUR_MESSAGE_COUNT: 'hour_message_count',
};


const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);


const statByDay = async (chatId) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayTimestamp = startOfDay / 1000;
  const data = (await client.getChatMessagesStatByDate(chatId, dayTimestamp));
  return { name: stats.TODAY_MESSAGE_COUNT, data };
};

const statByHour = async (chatId) => {
  const now = new Date();
  now.setHours(now.getHours() - 1);
  const hourTimestamp = Math.floor(now / 1000);
  const data = (await client.getChatMessagesStatByDate(chatId, hourTimestamp));
  return  { name: stats.HOUR_MESSAGE_COUNT, data };
};

module.exports = {
  stats,
  statByDay,
  statByHour,
};
