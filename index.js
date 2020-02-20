const Slimbot = require('slimbot');
const DBClient = require('./dbClient');

const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);
const client = new DBClient(
  process.env['MONGO_URL'],
  process.env['MONGO_DB_NAME']
);

// Register listeners
slimbot.on('message', message => {
  client.saveMessage(message);
});

slimbot.startPolling();
