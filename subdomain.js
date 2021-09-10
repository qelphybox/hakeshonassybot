#!/usr/bin/env node

// eslint-disable-next-line no-var
var subdomain = '';

if (process.env.BOT_NAME) {
  subdomain = process.env.BOT_NAME
    .toLowerCase()
    .replace(/[^a-z0-9]/, '');
}

if (process.env.SUBDOMAIN) {
  subdomain = process.env.SUBDOMAIN;
}

if (typeof process !== 'undefined') {
  console.log(process.argv[2] === '--full-url' ? `https://${subdomain}.loca.lt` : subdomain);
}

module.exports = { subdomain };
