const DBClient = require('./dbClient');


const stats = {
  TODAY_MESSAGE_COUNT: 'today_message_count',
  HOUR_MESSAGE_COUNT: 'hour_message_count',
  WORKLESS_USER: 'workless_user',
};


const client = new DBClient(
  process.env.MONGO_URL,
  process.env.MONGO_DB_NAME,
);


const statByDay = async ({ chatId, messageTimestamp }) => {
  const messageDate = new Date(messageTimestamp * 1000);
  messageDate.setDate(messageDate.getDate() - 1);
  const dayTimestamp = messageDate / 1000;
  const data = await client.getChatMessagesStatByDate(chatId, dayTimestamp);
  return { name: stats.TODAY_MESSAGE_COUNT, data };
};

const statByHour = async ({ chatId, messageTimestamp }) => {
  const messageDate = new Date(messageTimestamp * 1000);
  messageDate.setHours(messageDate.getHours() - 1);
  const hourTimestamp = Math.floor(messageDate / 1000);
  const data = await client.getChatMessagesStatByDate(chatId, hourTimestamp);
  return { name: stats.HOUR_MESSAGE_COUNT, data };
};

const worklessUser = async ({ chatId, messageTimestamp }) => {
  const messageDate = new Date(messageTimestamp * 1000);
  const mondayNumber = 1;
  const currentDay = messageDate.getDay();
  messageDate.setDate(messageDate.getDate() - (currentDay - mondayNumber));
  const dayTimestamp = messageDate / 1000;
  const data = await client.getWorklessUser(chatId, dayTimestamp);
  return { name: stats.WORKLESS_USER, data };
};

const statFunctions = {
  statByDay,
  statByHour,
  worklessUser,
};

module.exports = {
  stats,
  statFunctions,
};
