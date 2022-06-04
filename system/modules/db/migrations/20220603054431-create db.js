'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      cardid: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      profileimage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['Coordinator', 'Member', 'Visitor'],
      },
      occupation: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      linkedin: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      preferences: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          'sendActionRegEmail': true,
        },
      },
    },
      {
        modelName: 'users',
        paranoid: false,
        timestamps: false,
      });

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
        allowNull: false,
      },
      equipmentid: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      time: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT(2048),
        allowNull: true
      }
    }, {
      modelName: 'reservations',
      paranoid: false,
      timestamps: false
    })

    await queryInterface.createTable('equipments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.TEXT(2048),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Available', 'Reserved'],
        allowNull: false
      },
    }, {
      modelName: 'equipments',
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
      },
    }, {
      modelName: 'relatorys',
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
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ['Reservation', 'User'],
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Pending', 'Approved', 'Denied'],
        allowNull: false
      },
      laststatustime: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      data: {
        type: Sequelize.JSON,
        allowNull: false
      },
    }, {
      modelName: 'authorizations',
      paranoid: false,
      timestamps: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
    await queryInterface.dropTable('reservations')
    await queryInterface.dropTable('equipments')
    await queryInterface.dropTable('relatorys')
    await queryInterface.dropTable('authorizations')
  }
};
