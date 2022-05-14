'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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
        allowNull: false,
        references: {
          model: 'reservations',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.TEXT(2048),
        allowNull: false
      },
      laststatustime: {
        type: Sequelize.DATE,
        allowNull: false
      }
    },{
      modelName: 'authorizations',
      paranoid: false,
      timestamps: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('authorizations')
  }
};
