const crypto = require('crypto');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const getDataString = (dataObject) => Object.entries(dataObject)
  .map((e) => e.join('='))
  .sort((a, b) => a.localeCompare(b))
  .join('\n');

const getDataObjectHash = (token, dataObject) => {
  const secretKey = crypto
    .createHash('sha256')
    .update(token)
    .digest();

  const dataString = getDataString(dataObject);
  return crypto
    .createHmac('sha256', secretKey)
    .update(dataString)
    .digest('hex');
};

const checkHmacToken = (token, hash, dataObject) => {
  const hashFromData = getDataObjectHash(token, dataObject);
  return hash === hashFromData;
};

const validateTelegramAuth = ({ hash, ...userData }) => checkHmacToken(
  TELEGRAM_TOKEN, hash, userData,
);

module.exports = { checkHmacToken, validateTelegramAuth, getDataObjectHash };
