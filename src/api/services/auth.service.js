const crypto = require('crypto');

const getDataString = (dataObject) => Object.entries(dataObject)
  .map((e) => e.join('='))
  .sort((a, b) => a.localeCompare(b))
  .join('\n');

const checkHmacToken = (token, hash, dataObject) => {
  const secretKey = crypto
    .createHash('sha256')
    .update(token)
    .digest();

  const dataString = getDataString(dataObject);
  const hashFromData = crypto
    .createHmac('sha256', secretKey)
    .update(dataString)
    .digest('hex');

  return hash === hashFromData;
};

const validateTelegramAuth = ({ hash, ...userData }) => {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  return checkHmacToken(telegramToken, hash, userData);
};

module.exports = { checkHmacToken, validateTelegramAuth };
