'use strict';

module.exports = {
  up: function (migration, Sequelize) {
    return migration.addColumn('users', 'avatar', {
      type: Sequelize.STRING
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (migration, Sequelize) {
    return migration.removeColumn('users', 'avatar');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
