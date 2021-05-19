const { DataTypes, Model } = require('sequelize');
const { dbClient } = require('../dbClientPg');

class Metrics extends Model {}

Metrics.init({
  // Model attributes are defined here
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  usersChatsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  photoCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  videoCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stickerSetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  textLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  voiceCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  // Other model options go here
  modelName: 'Metrics', // We need to choose the model name
  underscored: true,
  timestamps: false,
  sequelize: dbClient.client, // We need to pass the connection instance
  tableName: 'Metrics',
});

module.exports = Metrics;
