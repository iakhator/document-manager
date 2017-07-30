'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [{
      title: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'facilitator',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'fellow',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function down(queryInterface) {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};