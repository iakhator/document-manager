'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _mockData = require('./mockData');

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);
var userToken = void 0,
    adminToken = void 0,
    sampleUserToken = void 0;
var admin = _mockData2.default.admin,
    fellow = _mockData2.default.fellow;


describe('Roles', function () {
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
  after(function (done) {
    _models2.default.User.destroy({ where: { id: { $notIn: [1, 2, 3] } } });
    done();
  });

  describe('/POST Role', function () {
    it('should add a new role if the user is an admin', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/roles').send({ title: 'boromir' }).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Role successfully created');
        expect(res.body).to.have.property('role');
        expect(res.body.role).to.have.property('title').to.equal('boromir');
      });
      done();
    });
    it('should add a new role if the user is an admin', function (done) {
      (0, _supertest2.default)(_index2.default).post('/api/v1/roles').send({ title: 'king' }).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(204);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Role successfully created');
        expect(res.body).to.have.property('role');
      });
      done();
    });
    it('Should fail if a non-admin wants to add a new role', function (done) {
      var role = {
        title: 'boromir-team'
      };
      (0, _supertest2.default)(_index2.default).post('/api/v1/roles/').set({ authorization: userToken }).send(role).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('You are not authorized');
        done();
      });
    });
    it('Should return an error if the title is not a string', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/roles').set({ authorization: adminToken }).send({ title: 358583 }).end(function (err, res) {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Invalid input credentials');
        done();
      });
    });
  });

  describe('/GET Role', function () {
    it('Should get all the roles if the user is an admin', function (done) {
      _chai2.default.request(_index2.default).get('/api/v1/roles').set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.length(5);
        expect(res.body).to.be.a('array');
        expect(res.body[0].id).to.eql(1);
        expect(res.body[0].title).to.eql('admin');
        expect(res.body[1].id).to.eql(2);
        expect(res.body[1].title).to.eql('facilitator');
        done();
      });
    });
    it('Should fail to get the roles if the user is not admin', function (done) {
      _chai2.default.request(_index2.default).get('/api/v1/roles').set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.eql('You are not authorized');
        done();
      });
    });
  });

  describe('/GET/:id Role', function () {
    it('Should get a role by id if the user is an admin', function (done) {
      var id = 2;
      _chai2.default.request(_index2.default).get('/api/v1/roles/' + id).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).be.a('object');
        expect(res.body.title).to.eql('facilitator');
        expect(res.body.id).to.equal(2);
        done();
      });
    });
    it('Should fail to get a role by id if the user is not an admin', function (done) {
      var id = 2;
      _chai2.default.request(_index2.default).get('/api/v1/roles/' + id).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.eql('You are not authorized');
        done();
      });
    });
    it('Should fail to get a role by id if the user enters an invalid input', function (done) {
      var id = 'fddjsdcdjn';
      _chai2.default.request(_index2.default).get('/api/v1/roles/' + id).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.eql('invalid input syntax for integer: "' + id + '"');
        done();
      });
    });
    it('Should fail to get a role by id if the role does not exist', function (done) {
      var id = 250;
      _chai2.default.request(_index2.default).get('/api/v1/roles/' + id).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.eql('Role not found');
        done();
      });
    });
    it('Should fail to get a role by id if the id is out of range', function (done) {
      var id = 500000000000000000000;
      _chai2.default.request(_index2.default).get('/api/v1/roles/' + id).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql('value "' + id + '" is out of range for type integer');
        done();
      });
    });
  });
  describe('/PUT/:id Role', function () {
    it('Should update a role by id if the user has admin access', function (done) {
      var id = 2;
      _chai2.default.request(_index2.default).put('/api/v1/roles/' + id).set({ authorization: adminToken }).send({ title: 'boromir-team' }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Role updated successfully');
        expect(res.body).to.have.property('role');
        done();
      });
    });
    it('Should fail to update a role by id if the user has no admin access', function (done) {
      var id = 2;
      _chai2.default.request(_index2.default).put('/api/v1/roles/' + id).set({ authorization: userToken }).send({ title: 'kiba' }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('You are not authorized');
        done();
      });
    });
    it('Should fail to update a\n       role by id if the admin enters an invalid input', function (done) {
      var id = 200;
      _chai2.default.request(_index2.default).put('/api/v1/roles/' + id).set({ authorization: adminToken }).send({ title: 'kiba' }).end(function (err, res) {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Role not found');
        done();
      });
    });
    it('Should fail to update a role by\n      id if the admin enters an id that is out range', function (done) {
      var id = 2000000000000000;
      _chai2.default.request(_index2.default).put('/api/v1/roles/' + id).set({ authorization: adminToken }).send({ title: 'regular' }).end(function (err, res) {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('value "' + id + '" is out of range for type integer');
        done();
      });
    });
  });
  describe('/DELETE/:id Role', function () {
    it('Should delete a role given the user has admin access', function (done) {
      var id = 3;
      _chai2.default.request(_index2.default).delete('/api/v1/roles/' + id).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(204);
        expect(res.body).to.be.a('object');
      });
      done();
    });
    it('Should fail to delete a role given the user has no admin access', function (done) {
      var id = 3;
      _chai2.default.request(_index2.default).delete('/api/v1/roles/' + id).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('You are not authorized');
        done();
      });
    });
    it('Should fail to delete a role given the admin enters an invalid input', function (done) {
      var id = 300;
      _chai2.default.request(_index2.default).delete('/api/v1/roles/' + id).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Role not found');
        done();
      });
    });
    it('Should fail to delete a role given\n      the admin enters an input that is out of range', function (done) {
      var id = 3000000000000000;
      _chai2.default.request(_index2.default).delete('/api/v1/roles/' + id).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('value "' + id + '" is out of range for type integer');
        done();
      });
    });
  });
});