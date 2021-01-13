const crypto = require('crypto');

const getDataString = (dataObject) => {
  const keys = Object.keys(dataObject).filter((key) => key !== 'hash');
  return keys
    .sort((a, b) => a.localeCompare(b))
    .map((key) => `${key}=${dataObject[key]}`)
    .join('\n');
};

const secretKey = crypto
  .createHash('sha256')
  .update(process.env.TELEGRAM_BOT_TOKEN)
  .digest();

const checkHmacToken = (dataObject) => {
  const dataString = getDataString(dataObject);
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataString)
    .digest('hex');

  return dataObject.hash === hash;
};

module.exports = { checkHmacToken };
