const { Model } = require('sequelize');
const User = require('./user.model');
const Chat = require('./chat.model');
const { dbClient } = require('../dbClientPg');

class UserChat extends Model {}

UserChat.init({
  sequelize: dbClient.client, // We need to pass the connection instance
  underscored: true,
  timestamps: false,
  modelName: 'UserChat', // We need to choose the model name
  tableName: 'users_chats',
});

Chat.belongsToMany(User, { through: 'UserChat' });
User.belongsToMany(Chat, { through: 'UserChat' });

module.exports = UserChat;
