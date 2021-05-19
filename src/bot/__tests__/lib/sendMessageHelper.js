const uuidv4 = require('uuid').v4;

const messageContentByType = {
  text: (text) => text || uuidv4(),
  voice: () => ({
    duration: 0,
    mime_type: 'audio/ogg',
    file_id: 'AwACAgIAAxkBAANCXsRFwwnuqJoIXLJbwJYGzrYY4QwAAnwFAAL4nyhKd5NzrU_Aw7QZBA',
    file_unique_id: 'AgADfAUAAvifKEo',
    file_size: 4521,
  }),
  photo: () => [{
    file_id: 'AgACAgIAAxkBAAM3XsREf78d0HJ5q1BDVOO-JCrN4eUAAnOtMRv4nyhKlf7nZcUI6IBIJ3eRLgADAQADAgADbQADtnIDAAEZBA',
    file_unique_id: 'AQADSCd3kS4AA7ZyAwAB',
    file_size: 16588,
    width: 320,
    height: 258,
  }, {
    file_id: 'AgACAgIAAxkBAAM3XsREf78d0HJ5q1BDVOO-JCrN4eUAAnOtMRv4nyhKlf7nZcUI6IBIJ3eRLgADAQADAgADeAADs3IDAAEZBA',
    file_unique_id: 'AQADSCd3kS4AA7NyAwAB',
    file_size: 61650,
    width: 800,
    height: 646,
  }, {
    file_id: 'AgACAgIAAxkBAAM3XsREf78d0HJ5q1BDVOO-JCrN4eUAAnOtMRv4nyhKlf7nZcUI6IBIJ3eRLgADAQADAgADeQADtHIDAAEZBA',
    file_unique_id: 'AQADSCd3kS4AA7RyAwAB',
    file_size: 128568,
    width: 1280,
    height: 1033,
  }],
  video: () => ({
    duration: 23,
    width: 480,
    height: 270,
    mime_type: 'video/mp4',
    thumb: {
      file_id: 'AAMCAgADGQEAAz5exEVXCaVMpK-xSeN2PyoE083tHwACegUAAvifKEpZkucng67NWFGNDpMuAAMBAAdtAANPEAACGQQ',
      file_unique_id: 'AQADUY0Oky4AA08QAAI',
      file_size: 21289,
      width: 320,
      height: 180,
    },
    file_id: 'BAACAgIAAxkBAAM-XsRFVwmlTKSvsUnjdj8qBNPN7R8AAnoFAAL4nyhKWZLnJ4OuzVgZBA',
    file_unique_id: 'AgADegUAAvifKEo',
    file_size: 1226294,
  }),
  sticker: ({ setName }) => ({
    width: 512,
    height: 512,
    emoji: '😆',
    set_name: setName,
    is_animated: false,
  }),
};

const sendTestMessage = async ({
  userId, firstName, date, type,
}, onMessage, bot, messageContentObj) => {
  const userMessage = {
    message_id: uuidv4(),
    from: {
      id: userId,
      is_bot: false,
      first_name: firstName,
    },
    chat: {
      id: 1,
    },
    date,
    [type]: messageContentByType[type](messageContentObj),
  };

  await onMessage(bot, userMessage);
};

const sendTestReplyMessage = async ({
  userId, firstName, date, type, messageForReply,
}, onMessage, bot, messageContentObj) => {
  const replyToMessage = {
    message_id: uuidv4(),
    from: {
      id: userId,
      is_bot: false,
      first_name: firstName,
    },
    chat: {
      id: 1,
    },
    date,
    [type]: messageContentByType[type](messageContentObj),
    reply_to_message: messageForReply,
  };

  await onMessage(bot, replyToMessage);
};

const createMockedSlimbot = (sendMessageFn) => ({ sendMessage: jest.fn(sendMessageFn) });

module.exports = { sendTestMessage, sendTestReplyMessage, createMockedSlimbot };
