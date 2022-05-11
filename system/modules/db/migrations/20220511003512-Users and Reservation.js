'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
      modelName: 'user',
      paranoid: false,
      timestamps: false
    })

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
      }
    }, {
      modelName: 'reservation',
      paranoid: false,
      timestamps: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reservations')
    await queryInterface.dropTable('users')
  }
};
