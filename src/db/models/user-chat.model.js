const { Model } = require('sequelize');
const { dbClient } = require('../dbClientPg');
const User = require('./user.model');
const Chat = require('./chat.model');

class UserChat extends Model {}

UserChat.init({
  sequelize: dbClient.client, // We need to pass the connection instance
});

Chat.belongsToMany(User, { through: UserChat });
User.belongsToMany(Chat, { through: UserChat });

module.exports = UserChat;
