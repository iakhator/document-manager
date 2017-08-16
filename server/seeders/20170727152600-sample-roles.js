module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Roles', [{
      title: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'fellow',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {}),

  down: queryInterface => queryInterface.bulkDelete('Roles', null, {})
};
