module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        first_name: {
          type: Sequelize.DataTypes.STRING,
        },
        last_name: {
          type: Sequelize.DataTypes.STRING,
        },
      });

      await queryInterface.createTable('chats', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
      });

      await queryInterface.createTable('users_chats', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        chat_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
      });

      await queryInterface.createTable('metrics', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        timestamp: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        users_chats_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        photo_count: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        video_count: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        question_count: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        sticker_set_name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        text_length: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        voice_count: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('users_chats');
      await queryInterface.dropTable('chats');
      await queryInterface.dropTable('users');
      await queryInterface.dropTable('metrics');
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
