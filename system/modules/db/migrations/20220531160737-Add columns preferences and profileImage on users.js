'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'preferences', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {
        'sendActionRegEmail': true,
      },
    });

    await queryInterface.addColumn('users', 'profileImage', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'preferences');
    await queryInterface.removeColumn('users', 'profileImage');
  }
};
