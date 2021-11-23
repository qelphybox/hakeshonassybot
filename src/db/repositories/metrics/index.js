const moment = require('moment');
const ChatsRepository = require('../chats');
const UsersRepository = require('../users');
const UserChatsRepository = require('../user_chats');

const BaseRepository = require('../base');
const saveQuery = require('./saveQuery');
const updateQuery = require('./updateQuery');
const dayCountQuery = require('./dayCountQuery');
const hourCountQuery = require('./hourCountQuery');
const worklessUserQuery = require('./worklessUserQuery');

const getAllQuery = 'SELECT * FROM message_metrics';

class MetricsRepository extends BaseRepository {
  constructor() {
    super();
    this.chatsRepository = new ChatsRepository();
    this.usersRepository = new UsersRepository();
    this.userChatasRepository = new UserChatsRepository();
  }

  async saveMessageMetrics({ user, chat, messageMetrics }) {
    const chatResult = await this.chatsRepository.save(chat);
    const userResult = await this.usersRepository.save(user);
    const userChatResult = await this.userChatasRepository
      .save({ user: userResult, chat: chatResult });
    await this.save(messageMetrics, userChatResult);
  }

  async saveMessageMetricsTransaction(...args) {
    const saveMessageMetrics = this.queryWithTransaction(this.saveMessageMetrics.bind(this));
    await saveMessageMetrics(...args);
  }

  async save(messageMetric, userChat) {
    const values = [
      messageMetric.tg_id,
      messageMetric.timestamp,
      userChat.id,
      messageMetric.photoCount,
      messageMetric.videoCount,
      messageMetric.questionCount,
      messageMetric.stickerSetName,
      messageMetric.textLength,
      messageMetric.voiceCount,
      messageMetric.lolReplyForUser,
    ];
    const result = await this.client.query(saveQuery, values);
    return result.rows[0];
  }

  async update(messageMetric) {
    const values = [
      messageMetric.tg_id,
      messageMetric.timestamp,
      messageMetric.photoCount,
      messageMetric.videoCount,
      messageMetric.questionCount,
      messageMetric.stickerSetName,
      messageMetric.textLength,
      messageMetric.voiceCount,
      messageMetric.lolReplyForUser,
    ];
    const result = await this.client.query(updateQuery, values);
    return result.rows[0];
  }

  async getAll() {
    const result = await this.client.query(getAllQuery);
    return result.rows;
  }

  async getHourCount(tgId, date) {
    const values = [tgId, date];
    const result = await this.client.query(hourCountQuery, values);
    return result.rows;
  }

  async getDayCount(tgId, date) {
    const values = [tgId, date];

    const result = await this.client.query(dayCountQuery, values);
    return result.rows;
  }

  async getWorklessUser(tgId, date, dayTimestamp) {
    const values = [tgId, date, dayTimestamp];

    const result = await this.client.query(worklessUserQuery, values);
    return result.rows;
  }
}

module.exports = MetricsRepository;
