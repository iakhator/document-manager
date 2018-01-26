import chai from 'chai';
import db from '../../models';
import mockData from '../controllers/mockData';

const expect = chai.expect;

describe('User Model', () => {
  const uniqueFields = ['userName', 'email'];
  const defaultRoleId = 2;

  describe('Create', () => {
    it('should not create a user when email is invalid', (done) => {
      db.User.create(mockData.invalidEmailUser)
        .then()
        .catch((error) => {
          expect(error.errors[0].message)
            .to.equal('Input a valid email address');
          expect(error.errors[0].type).to.equal('Validation error');
          expect(error.errors[0].path).to.equal('email');
          done();
        });
    });
    it('should create a user', (done) => {
      db.User.create(mockData.regularUser)
        .then((user) => {
          expect(user.dataValues.firstName)
            .to.equal(mockData.regularUser.firstName);
          expect(user.dataValues.userName)
            .to.equal(mockData.regularUser.userName);
          expect(user.dataValues.email).to.equal(mockData.regularUser.email);
          expect(user.dataValues.roleId).to.equal(defaultRoleId);
          expect(user.dataValues.password)
            .to.equal(mockData.regularUser.password);
          done();
        });
    });
    uniqueFields.forEach((field) => {
      const uniqueTest = Object.assign({}, mockData.firstUser);
      uniqueTest[field] = mockData.regularUser[field];
      it(`should fail to create user
        if a unique ${field} already exist`, (done) => {
        db.User.create(uniqueTest)
        .then()
        .catch((error) => {
          expect(error.errors[0].message).to.equal(`${field} already exist`);
          expect(error.errors[0].type).to.equal('unique violation');
          expect(error.errors[0].path).to.equal(field);
          done();
        });
      });
    });
  });
});
