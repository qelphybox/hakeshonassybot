require('dotenv').config();
const config = require('./src/client/config').default;

console.log(`Your domain: ${config.DOMAIN}\n`);
