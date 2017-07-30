const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Users', [{
      userName: 'bank',
      fullName: 'Baas Bank',
      email: 'baas@test.com',
      password: bcrypt.hashSync(process.env.TEST_ADMIN_PASSWORD, bcrypt.genSaltSync(10)),
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      userName: 'john',
      fullName: 'John Bosco',
      email: 'john@test.com',
      password: bcrypt.hashSync(process.env.TEST_FELLOW_PASSWORD, bcrypt.genSaltSync(10)),
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      userName: 'blessing',
      fullName: 'Blessing Philip',
      email: 'blessing@test.com',
      password: bcrypt.hashSync(process.env.TEST_FACILITATOR_PASSWORD, bcrypt.genSaltSync(10)),
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
