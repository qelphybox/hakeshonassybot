const DBClient = require('./dbClient');


const stats = {
  TODAY_MESSAGE_COUNT: 'today_message_count',
  HOUR_MESSAGE_COUNT: 'hour_message_count',
};


const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);


const statByDay = async (statsRequestObj) => {
  const { chatId, messageTimestamp } = statsRequestObj;
  const messageDate = new Date(messageTimestamp);
  messageDate.setDate(messageDate.getDate() - 1);
  const dayTimestamp = messageDate / 1000;
  const data = await client.getChatMessagesStatByDate(chatId, dayTimestamp);
  console.log(data)
  return { name: stats.TODAY_MESSAGE_COUNT, data };
};

const statByHour = async (statsRequestObj) => {
  const { chatId, messageTimestamp } = statsRequestObj;
  const messageDate = new Date(messageTimestamp);
  messageDate.setHours(messageDate.getHours() - 1);
  const hourTimestamp = Math.floor(messageDate / 1000);
  const data = await client.getChatMessagesStatByDate(chatId, hourTimestamp);
  console.log(data)
  return  { name: stats.HOUR_MESSAGE_COUNT, data };
};

module.exports = {
  stats,
  statByDay,
  statByHour,
};
