const { dbClient } = require('./dbClient');

const stats = {
  TODAY_MESSAGE_COUNT: 'today_message_count',
  HOUR_MESSAGE_COUNT: 'hour_message_count',
  WORKLESS_USER: 'workless_user',
  WORST_CHAT_USER: 'worst_chat_user',
};

const statByDay = async ({ chatId, messageTimestamp }) => {
  const messageDate = new Date(messageTimestamp * 1000);
  messageDate.setDate(messageDate.getDate() - 1);
  const dayTimestamp = messageDate / 1000;
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chatId, date: { $gt: dayTimestamp } } },
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
  ).toArray());
  return { name: stats.TODAY_MESSAGE_COUNT, data };
};

const statByHour = async ({ chatId, messageTimestamp }) => {
  const messageDate = new Date(messageTimestamp * 1000);
  messageDate.setHours(messageDate.getHours() - 1);
  const hourTimestamp = Math.floor(messageDate / 1000);
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chatId, date: { $gt: hourTimestamp } } },
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
  ).toArray());
  return { name: stats.HOUR_MESSAGE_COUNT, data };
};

const worklessUser = async ({ chatId, messageTimestamp }) => {
  const messageDate = new Date(messageTimestamp * 1000);
  const mondayNumber = 1;
  const currentDay = messageDate.getDay();
  messageDate.setDate(messageDate.getDate() - (currentDay - mondayNumber));
  const dayTimestamp = messageDate / 1000;
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chatId, date: { $gt: dayTimestamp } } },
      {
        $project: {
          _id: 1,
          'from.id': 1,
          'from.username': 1,
          'from.first_name': 1,
          'from.last_name': 1,
          dayOfWeek: {
            $dayOfWeek: {
              $toDate: { $multiply: ['$date', 1000] },
            },
          },
          hour: { $hour: { $toDate: { $multiply: ['$date', 1000] } } },
        },
      },
      {
        $match: {
          $expr: {
            $in: ['$dayOfWeek', [2, 3, 4, 5, 6]],
          },
        },
      },
      { $match: { $expr: { $and: [{ $gte: ['$hour', 10] }, { $lt: ['$hour', 18] }] } } },
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
    .toArray());
  return { name: stats.WORKLESS_USER, data };
};

const worstChatUser = async ({ chatId }) => {
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
      { $match: { 'chat.id': chatId, voice: { $exists: true } } },
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
    .toArray());
  return { name: stats.WORST_CHAT_USER, data };
};

const statFunctions = {
  statByDay,
  statByHour,
  worklessUser,
  worstChatUser,
};

module.exports = {
  stats,
  statFunctions,
};
