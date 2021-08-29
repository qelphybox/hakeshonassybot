const ChatsRepository = require('../chats');
const UsersRepository = require('../users');
const UserChatsRepository = require('../user_chats');

const BaseRepository = require('../base');

const saveQuery = `INSERT INTO message_metrics(tg_id,
                                   timestamp,
                                   users_chats_id,
                                   photoCount,
                                   videoCount,
                                   questionCount,
                                   stickerSetName,
                                   textLength,
                                   voiceCount,
                                   lolReplyForUser)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (tg_id) DO UPDATE SET tg_id=EXCLUDED.tg_id RETURNING *`;

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

  async saveMessageMetricsTranslation(...args) {
    const saveMessageMetrics = this.queryWithTransaction(this.saveMessageMetrics.bind(this));
    await saveMessageMetrics(...args);
  }

  async save(messageMetric, userChat) {
    const values = [
      messageMetric.tg_id,
      new Date(), // FIXME: сохранять date из message
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

  async getAll() {
    const result = await this.client.query(getAllQuery);
    return result.rows;
  }
}

module.exports = MetricsRepository;
