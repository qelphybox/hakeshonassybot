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

console.log(subdomain);
module.exports = { subdomain };
