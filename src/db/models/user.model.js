const { DataTypes, Model } = require('sequelize');
const Chat = require('./chat.model');
const { dbClient } = require('../dbClientPg');

class User extends Model {}

User.init({
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

User.belongsToMany(Chat, { through: 'UserChat' });

module.exports = User;
