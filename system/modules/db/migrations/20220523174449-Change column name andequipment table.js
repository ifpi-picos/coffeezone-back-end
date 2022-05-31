'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('reservations', 'equipment');

    await queryInterface.addColumn('reservations', 'equipmentid', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.createTable('equipments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.TEXT(2048),
        allowNull: false,
      },
      status: {
        type: Sequelize.TEXT(2048),
        allowNull: false,
      },
    },
    {
      modelName: 'equipments',
      paranoid: false,
      timestamps: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('reservations', 'equipmentid');

    await queryInterface.addColumn('reservations', 'equipment', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.dropTable('equipments');
  }
};
