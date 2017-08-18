import chai from 'chai';
import db from '../../models';
import helper from '../controllers/mockData';

const expect = chai.expect;

describe('User Model', () => {
  const uniqueFields = ['userName', 'email'];
  const defaultRoleId = 2;
  let regularUser;

  describe('Create user', () => {
    it('should create a user', (done) => {
      db.User.create(helper.regularUser)
        .then((user) => {
          regularUser = user.dataValues;
          expect(user.dataValues.firstName)
            .to.equal(helper.regularUser.firstName);
          expect(user.dataValues.userName)
            .to.equal(helper.regularUser.userName);
          expect(user.dataValues.email).to.equal(helper.regularUser.email);
          expect(user.dataValues.roleId).to.equal(defaultRoleId);
          expect(user.dataValues.password)
            .to.equal(helper.regularUser.password);
          done();
        });
    });
    it('should not create a user when email is invalid', (done) => {
      db.User.create(helper.invalidEmailUser)
        .then()
        .catch((error) => {
          expect(error.errors[0].message)
            .to.equal('Input a valid email address');
          expect(error.errors[0].type).to.equal('Validation error');
          expect(error.errors[0].path).to.equal('email');
          done();
        });
    });
  });

  describe('Unique', () => {
    uniqueFields.forEach((field) => {
      const uniqueTest = Object.assign({}, helper.firstUser);
      uniqueTest[field] = helper.regularUser[field];
      it(`should fails for existing ${field}`, (done) => {
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
