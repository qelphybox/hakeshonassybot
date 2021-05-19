const { DataTypes } = require('sequelize');
const { dbClient } = require('../dbClientPg');

// class Chat extends Model {}
//
// Chat.init({
//   // Model attributes are defined here
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// }, {
//   // Other model options go here
//   underscored: true,
//   timestamps: false,
//   sequelize: dbClient.client, // We need to pass the connection instance
//   modelName: 'Chat', // We need to choose the model name
//   tableName: 'chats',
//
// });

const Chat = dbClient.client.define('Chat', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // Other model options go here
  underscored: true,
  timestamps: false,
  sequelize: dbClient.client, // We need to pass the connection instance
  modelName: 'Chat', // We need to choose the model name
  tableName: 'chats',

});
const User = dbClient.client.define('User', {
  // Model attributes are defined here
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
}, {
  // Other model options go here
  underscored: true,
  timestamps: false,
  sequelize: dbClient.client, // We need to pass the connection instance
  modelName: 'User', // We need to choose the model name
  tableName: 'users',
});

Chat.belongsToMany(User, {
  through: 'users_chats',
  as: 'users',
  foreignKey: 'chat_id',
  timestamps: false,
});

User.belongsToMany(Chat, {
  through: 'users_chats',
  as: 'chats',
  foreignKey: 'user_id',
  timestamps: false,
});

module.exports = { Chat, User };
