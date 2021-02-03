const { getDataObjectHash } = require('../../services/auth.service');

const extractCookies = (headers) => {
  const cookies = headers['set-cookie'][0];

  return cookies
    .split(';')
    .reduce((res, c) => {
      const [key, val] = c.trim().split('=').map(decodeURIComponent);
      try {
        return Object.assign(res, { [key]: JSON.parse(val) });
      } catch (e) {
        return Object.assign(res, { [key]: val });
      }
    }, {});
};

const generateUserSession = (tgToken, userData) => {
  const hash = getDataObjectHash(tgToken, userData);
  return { hash, ...userData };
};

module.exports = { extractCookies, generateUserSession };
