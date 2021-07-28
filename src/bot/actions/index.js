const fs = require('fs');
const util = require('util');
const { createMessageMetric } = require('../../db/queries/message_metrics');
const { createUserChat } = require('../../db/queries/user_chats');
const { createUser } = require('../../db/queries/users');
const { createChat } = require('../../db/queries/chats');
const { statsArray } = require('../statistics');
const { dbClient } = require('../../db/dbClientPg');

const isCommand = ({ entities }) => !!entities && entities.some((entity) => entity.type === 'bot_command');

const renderMessage = (statsStringsArray) => statsStringsArray
  .filter((statString) => statString.length > 0)
  .join('\n');

const getPhotoCount = (photo, text) => ((photo || /.*.jpg|.*.png/.test(text)) ? 1 : 0);
const getVideoCount = (video, text) => ((video || /.*youtu.be*|.*youtube.com*/.test(text)) ? 1 : 0);
const getDudCount = (text) => (/\?/.test(text) ? 1 : 0);
const getStickySetName = (sticker) => (sticker && sticker.set_name ? sticker.set_name : '');
const getTextLength = (text) => (text ? text.length : 0);
const getVoiceCount = (voice) => (voice ? 1 : 0);

const fetchMessageMetrics = ({
  from, chat, message_id: messageId, date, photo, video, text, sticker, voice,
}) => ({
  user: {
    tg_id: from.id,
    first_name: from.first_name,
    last_name: from.last_name,
  },
  chat: {
    tg_id: chat.id,
    name: chat.title,
  },
  messageMetrics: {
    tg_id: messageId,
    timestamp: date,
    photoCount: getPhotoCount(photo, text), // определяем наличие фото в сообщении как в contentSuppier
    videoCount: getVideoCount(video, text), // определяем наличие видео в сообщении как в contentSuppier
    questionCount: getDudCount(text), // если в тексте есть вопрос, ставим 1 (осторожно urlы)
    stickerSetName: getStickySetName(sticker),
    textLength: getTextLength(text),
    voiceCount: getVoiceCount(voice), // ставим 1 если сообщение это голосуха
    lolReplyForUser: 2, // humoristStat ищем в сообщениии реакцию смеха, и если она есть записываем сюда id юзера из реплая reply_to_message.from.id
  },
});

const stats = async (bot, message) => {
  const statsText = await Promise.all(statsArray.map(async ({ render, collect }) => {
    const collection = await collect(message);
    return render(collection);
  }));

  const text = renderMessage(statsText);
  bot.sendMessage(
    message.chat.id,
    text,
    { disable_web_page_preview: true, parse_mode: 'Markdown' },
  );
};

const rickroll = async (bot, message) => {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const text = `[Самый сильный младенец купил бмв](${url})`;
  await bot.sendMessage(
    message.chat.id,
    text,
    { disable_web_page_preview: true, parse_mode: 'Markdown' },
  );
};

const readFile = util.promisify(fs.readFile);
const version = async (bot, message) => {
  const versionFilePath = `${__dirname}/../../../version.txt`;
  try {
    const text = await readFile(versionFilePath, 'utf8');
    await bot.sendMessage(message.chat.id, text);
  } catch (e) {
    console.error(e);
  }
};

const onMessage = async (bot, message) => {
  if (isCommand(message)) {
    if (message.text.startsWith('/stats')) {
      await stats(bot, message);
    }
    if (message.text.startsWith('/rickroll')) {
      await rickroll(bot, message);
    }
    if (message.text.startsWith('/version')) {
      await version(bot, message);
    }
  } else {
    console.log('message: ', message);

    const { chat, user, messageMetrics } = fetchMessageMetrics(message);

    const client = await dbClient.getClient();
    await client.query('BEGIN');
    const chatResult = await createChat(chat);
    console.log('chatResult: ', chatResult);
    const userResult = await createUser(user);
    console.log('userResult: ', userResult);
    const userChatResult = await createUserChat({ user: userResult, chat: chatResult });
    console.log('userChatResult: ', userChatResult);
    const messageMetricResult = await createMessageMetric(messageMetrics, userChatResult);
    console.log('messageMetricResult: ', messageMetricResult);
    await client.query('COMMIT');
    await client.query('ROLLBACK');
    // TODO: ВЕРНУТЬ ЗАПИСЬ В МОНГУ
    // await dbClient.queryMessages(async (messages) => {
    //   await messages.insertOne(message);
    // });
  }
};

const onMessageEdit = async (bot, editedMessage) => {
  await dbClient.queryMessages(async (messages) => {
    await messages.updateOne(
      { message_id: editedMessage.message_id },
      { $set: editedMessage },
    );
  });
};

module.exports = { onMessage, onMessageEdit };
