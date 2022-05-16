'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      actions: {
        type: Sequelize.JSON,
        allowNull: false
      },
    },{
      modelName: 'relatorys',
      paranoid: false,
      timestamps: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('relatorys')
  }
};
