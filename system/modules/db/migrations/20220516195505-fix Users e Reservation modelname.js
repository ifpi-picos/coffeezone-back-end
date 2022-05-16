'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // edit user model name to users

    await queryInterface.renameTable('users', 'users_old')
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cardid: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      occupation: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      linkedin: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
    }, {
      modelName: 'users',
      paranoid: false,
      timestamps: false
    })

    await queryInterface.renameTable('reservations', 'reservations_old')
    await queryInterface.createTable('reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      equipment: {
        type: Sequelize.TEXT(2048),
        allowNull: true
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT(2048),
        allowNull: true
      },
    }, {
      modelName: 'reservations',
      paranoid: false,
      timestamps: false
    })

    // move data from old tables to new tables
    await queryInterface.sequelize.query(`
      INSERT INTO users (id, cardid, name, email, phone, password, occupation, type, linkedin)
      SELECT id, cardid, name, email, phone, password, occupation, type, linkedin
      FROM users_old
    `)

    await queryInterface.sequelize.query(`
      INSERT INTO reservations (id, userid, equipment, time, reason)
      SELECT id, userid, equipment, time, reason
      FROM reservations_old
    `)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
