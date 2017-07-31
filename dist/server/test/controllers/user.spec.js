'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _index = require('../../../index');

var _index2 = _interopRequireDefault(_index);

var _mockData = require('./mockData');

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);
var userToken = void 0,
    adminToken = void 0,
    sampleUserToken = void 0;
var admin = _mockData2.default.admin,
    fakeBass = _mockData2.default.fakeBass,
    fellow = _mockData2.default.fellow,
    user1 = _mockData2.default.user1,
    user2 = _mockData2.default.user2;


describe('Users', function () {
  before(function (done) {
    (0, _supertest2.default)(_index2.default).post('/api/v1/users/login').send(admin).end(function (err, res) {
      adminToken = res.body.token;
      done();
    });
  });
  before(function (done) {
    (0, _supertest2.default)(_index2.default).post('/api/v1/users/login').send(fellow).end(function (err, res) {
      userToken = res.body.token;
      done();
    });
  });
  before(function (done) {
    (0, _supertest2.default)(_index2.default).post('/api/v1/users/login').send({ email: 'blessing@test.com', password: 'pass123' }).end(function (err, res) {
      sampleUserToken = res.body.token;
      done();
    });
  });

  describe('/POST User login', function () {
    it('Should fail if the user enters incorrect crendentials upon login', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/users/login').send(user1).end(function (err, res) {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.keys(['message', 'success']);
        expect(res.body.message).to.eql('Authentication failed. User not found.');
        expect(res.body.success).to.eql(false);
        done();
      });
    });

    it('Should fail if the user provide a wrong password', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/users/login').send(user2).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.keys(['message', 'success']);
        expect(res.body.message).to.eql('Authentication failed. Wrong password.');
        expect(res.body.success).to.eql(false);
        done();
      });
    });

    it('should log in a user and return a token', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/users/login').send(admin).end(function (err, res) {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.keys(['success', 'token']);
        expect(res.body.success).to.eql(true);
        done();
      });
    });

    describe('/POST User Signup', function () {
      it('should create a new user', function (done) {
        (0, _supertest2.default)(_index2.default).post('/api/v1/users/').send(fakeBass).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message', 'success', 'userDetails']);
          expect(res.body.success).to.eql(true);
          expect(res.body.message).to.eql('You have successfully registered.');
          done();
        });
      });
    });

    describe('#GET Users', function () {
      it('Should get all users if the user is an admin ', function (done) {
        (0, _supertest2.default)(_index2.default).get('/api/v1/users').set({ authorization: adminToken }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys(['user', 'pagination']);
          done();
        });
      });
      it('Should fail to get all users if the user has no admin access ', function (done) {
        (0, _supertest2.default)(_index2.default).get('/api/v1/users').set({ authorization: userToken }).end(function (err, res) {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('You are not authorized');
          done();
        });
      });
      it('Should fail to get all users if no token was provided', function (done) {
        (0, _supertest2.default)(_index2.default).get('/api/v1/users').end(function (err, res) {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('No token provided.');
          done();
        });
      });
      it('Should get all users with correct limit as a query', function (done) {
        var limit = 1;
        _chai2.default.request(_index2.default).get('/api/v1/users?limit=' + limit).set({ authorization: adminToken }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.user[0].fullName).to.equal('Baas Bank');
          expect(res.body.user[0].userName).to.equal('bank');
          done();
        });
      });
    });
    describe('#GET User by Id', function () {
      it('Should get a user if the user is an admin', function (done) {
        var id = 2;
        (0, _supertest2.default)(_index2.default).get('/api/v1/users/' + id).set({ authorization: adminToken }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).be.a('array');
          expect(res.body[0].fullName).to.eql('John Bosco');
          expect(res.body[0].id).to.eql(2);
          expect(res.body[0].userName).to.eql('john');
          expect(res.body[0].email).to.eql('john@test.com');
          expect(res.body[0].roleId).to.eql(2);
          done();
        });
      });
      it('Should get the user if the requested user is the current user', function (done) {
        var id = 2;
        (0, _supertest2.default)(_index2.default).get('/api/v1/users/' + id).set({ authorization: userToken }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).be.a('array');
          expect(res.body[0].fullName).to.eql('John Bosco');
          expect(res.body[0].id).eql(2);
          expect(res.body[0].userName).to.eql('john');
          expect(res.body[0].email).to.eql('john@test.com');
          expect(res.body[0].roleId).to.eql(2);
          done();
        });
      });
      it('Should fail to get a user if an invalid input is entered', function (done) {
        var id = 'fddjsdcdjn';
        (0, _supertest2.default)(_index2.default).get('/api/v1/users/' + id).set({ authorization: adminToken }).end(function (err, res) {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('message').to.eql('invalid input syntax for integer: "' + id + '"');
          done();
        });
      });
      it('should fail to get the user if the requester is not the owner', function (done) {
        var id = 2;
        (0, _supertest2.default)(_index2.default).get('api/users/' + id).set({ authorization: sampleUserToken }).end(function (err, res) {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Unauthorized access');
        });
        done();
      });
      it('Should fail to get a user if the user does not exist', function (done) {
        var id = 250;
        (0, _supertest2.default)(_index2.default).get('/api/v1/users/' + id).set({ authorization: adminToken }).end(function (err, res) {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('User not found');
          done();
        });
      });
      // it('Should fail to get a user if the id is out of range',
      // (done) => {
      //   const id = 500000000000000000;
      //   request(server)
      //     .get(`/api/v1/users/${id}`)
      //     .set({ authorization: adminToken })
      //     .end((err, res) => {
      //       expect(res.status).to.equal(400);
      //       expect(res.body).to.have.property('message')
      //       .to.equal(`value "${id}" is out of range for type integer`);
      //       done();
      //     });
      // });
    });
    describe('#PUT Update user by Id', function () {
      it('Should update a user`s full name if the user has the same id', function (done) {
        var id = 2;
        (0, _supertest2.default)(_index2.default).put('/api/v1/users/' + id).set({ authorization: userToken }).send({ fullName: 'jake doe' }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(2);
          expect(res.body.fullName).to.eql('jake doe');
          done();
        });
      });
      it('Should update a user`s email if the user has the same id', function (done) {
        var id = 2;
        (0, _supertest2.default)(_index2.default).put('/api/v1/users/' + id).set({ authorization: userToken }).send({ email: 'jakedoe@andela.com' }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(2);
          expect(res.body.email).to.eql('jakedoe@andela.com');
          done();
        });
      });
      it('Should update a user`s username if the user has the same id', function (done) {
        var id = 2;
        (0, _supertest2.default)(_index2.default).put('/api/v1/users/' + id).set({ authorization: userToken }).send({ userName: 'jakedoe12' }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(2);
          expect(res.body.userName).to.eql('jakedoe12');
          done();
        });
      });
      it('Should fail to update a user\'s\n      details if the user does not have the same user id', function (done) {
        var id = 3;
        (0, _supertest2.default)(_index2.default).put('/api/v1/users/' + id).set({ authorization: userToken }).send({ email: 'jakedoe@andela.com' }).end(function (err, res) {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('You are not authorized to access this user');
          done();
        });
      });
      it('Should fail to update a user\'s\n        details if the user enters an invalid user id', function (done) {
        var id = 2302;
        (0, _supertest2.default)(_index2.default).put('/api/v1/users/' + id).set({ authorization: userToken }).send({ email: 'jakedoe@andela.com' }).end(function (err, res) {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('You are not authorized to access this user');
          done();
        });
      });
    });
    describe('#DELETE /:id Users', function () {
      it('Should delete a user given the user has admin access', function (done) {
        var id = 3;
        (0, _supertest2.default)(_index2.default).delete('/api/v1/users/' + id).set({ authorization: adminToken }).end(function (err, res) {
          expect(res.status).to.equal(204);
          done();
        });
      });
      it('Should fail to delete a user if the user has no admin access', function (done) {
        var id = 3;
        (0, _supertest2.default)(_index2.default).delete('/api/v1/users/' + id).set({ authorization: userToken }).end(function (err, res) {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.eql('You are not authorized to access this field');
          done();
        });
      });
      it('Should give a User not found if user don\'t exist', function (done) {
        var id = 23;
        (0, _supertest2.default)(_index2.default).delete('/api/v1/users/' + id).set({ authorization: adminToken }).end(function (err, res) {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('User not found');
          done();
        });
      });
    });
    describe('/GET/users/:id/documents Documents', function () {
      it('Should fail to get documents if the user does not exist', function (done) {
        var userId = 9;
        (0, _supertest2.default)(_index2.default).get('/api/v1/users/' + userId + '/documents').set({ authorization: userToken }).end(function (err, res) {
          expect(res.status).to.equal(404);
          expect(res.body).be.a('object');
          expect(res.body.message).to.eql('User not found');
          done();
        });
      });
      it('Should fail to get documents if there is no token present', function (done) {
        var userId = 2;
        (0, _supertest2.default)(_index2.default).get('/api/v1/users/' + userId + '/documents').end(function (err, res) {
          expect(res.status).to.equal(403);
          expect(res.body).be.a('object');
          expect(res.body.message).to.eql('No token provided.');
          expect(res.body.success).to.eql(false);
          done();
        });
      });
      it('Should get documents for the user with its unique userId', function (done) {
        var userId = 2;
        (0, _supertest2.default)(_index2.default).get('/api/v1/users/' + userId + '/documents').set({ authorization: userToken }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).be.a('object');
          expect(res.body.document[1].userId).to.eql(2);
          expect(res.body.document[1].title).to.eql('boromir-team');
          expect(res.body.document[1].content).to.eql('Andela is really awesome!!!');
          done();
        });
      });
    });
  });
});