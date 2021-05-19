const { Model } = require('sequelize');
const { DataTypes } = require('sequelize');
const { dbClient } = require('../dbClientPg');

class Chat extends Model {}

Chat.init({
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

module.exports = Chat;
