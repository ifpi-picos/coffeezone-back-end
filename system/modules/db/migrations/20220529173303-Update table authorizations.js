'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('authorizations', 'laststatustime');
    await queryInterface.addColumn('authorizations', 'laststatustime', Sequelize.STRING(255))
    await queryInterface.addColumn('authorizations', 'type', Sequelize.TEXT(2048))
    await queryInterface.addColumn('authorizations', 'data', Sequelize.JSON)
    await queryInterface.removeColumn('authorizations', 'reservationid')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('authorizations', 'reservationid', Sequelize.INTEGER)
    await queryInterface.removeColumn('authorizations', 'type')
    await queryInterface.removeColumn('authorizations', 'data')
    await queryInterface.removeColumn('authorizations', 'laststatustime');
    await queryInterface.addColumn('authorizations', 'laststatustime', Sequelize.DATE)
  }
};
