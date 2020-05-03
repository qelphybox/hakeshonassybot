const DBClient = require('./dbClient');

const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);


const saveMessagesStatByTime = async (timestamp, statName) => {
  const messagesStatsByChat = await client.getMessagesStatByDate(timestamp);
  const chats = await client.getAllChats();

  for (const chat of chats) {
    const chatInStats = messagesStatsByChat.find(statByChat => statByChat._id === chat._id);
    if (!chatInStats) {
      await client.resetChatStat(chat._id, statName)
    }
  }

  for (const stat of messagesStatsByChat) {
    const chat = chats.find((chat) => chat._id === stat._id);
    if (!chat) {
      const chat = {
        _id: stat._id,
        [statName]: stat.stats
      };
      await client.saveChat(chat);
    } else {
      chat[statName] = stat.stats;
      await client.saveChat(chat);
    }
  }
};


const worker = async () => {
  console.log('worker run');
  // by day
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const dayTimestamp = startOfDay / 1000;
  await saveMessagesStatByTime(dayTimestamp, 'today_message_count');


  // by hour
  const d = new Date();
  d.setHours(d.getHours() - 1);
  const hourTimestamp = Math.floor(d / 1000);


  await saveMessagesStatByTime(hourTimestamp, 'hour_message_count');
};

const runWorker = () => worker().then(() => setTimeout(runWorker, 20000));

runWorker();
