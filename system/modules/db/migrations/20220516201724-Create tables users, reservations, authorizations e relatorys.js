'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
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
    },
      {
        modelName: 'users',
        paranoid: false,
        timestamps: false
      })

    await queryInterface.createTable('authorizations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      reservationid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.TEXT(2048),
        allowNull: false
      },
      laststatustime: {
        type: Sequelize.DATE,
        allowNull: false
      }
    },
      {
        modelName: 'authorizations',
        paranoid: false,
        timestamps: false
      })

    await queryInterface.createTable('reservations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      equipment: {
        type: Sequelize.TEXT(2048),
        allowNull: true
      },
      time: {
        type: Sequelize.TEXT(2048),
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT(2048),
        allowNull: true
      }
    },
      {
        modelName: 'reservations',
        paranoid: false,
        timestamps: false
      })

    await queryInterface.createTable('relatorys', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      actions: {
        type: Sequelize.JSON,
        allowNull: false
      }
    },
      {
        modelName: 'relatorys',
        paranoid: false,
        timestamps: false
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
    await queryInterface.dropTable('authorizations')
    await queryInterface.dropTable('reservations')
    await queryInterface.dropTable('relatorys')
  }
};
