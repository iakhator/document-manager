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
    sampleUserToke = void 0;
var admin = _mockData2.default.admin,
    fellow = _mockData2.default.fellow;


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
  after(function (done) {
    _models2.default.User.destroy({ where: { id: { $notIn: [1, 2, 3] } } });
    done();
  });

  describe('/SEARCH/users/?q={name}', function () {
    it('Should return an error if no querystring is provided', function () {
      var query = '';
      (0, _supertest2.default)(_index2.default).get('/api/v1/search/users/?q=' + query).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql('Inval search input');
      });
    });
    it('Should return a search list response of the required search input', function () {
      var query = 'jame';
      (0, _supertest2.default)(_index2.default).get('/api/v1/search/users/?q=' + query).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body.fullName).to.eql('jame doe');
        expect(res.body.userName).to.eql('testdoe');
      });
    });
  });
  describe('/SEARCH/documents/?q=', function () {
    it('Should return an error if no querystring is provided', function () {
      var query = '';
      (0, _supertest2.default)(_index2.default).get('/api/v1/search/documents/?q=' + query).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message').to.equal('Invalid search input');
      });
    });
    it('Should return a search list of the required search input', function () {
      var query = 'John';
      (0, _supertest2.default)(_index2.default).get('/api/v1/search/documents/?q=' + query).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('document');
        expect(res.body.document[0]).to.have.property('title').to.equal('John Doe');
        expect(res.body.document[0]).to.have.property('content').to.equal('eze goes to school');
        expect(res.body).to.have.property('pagination');
        expect(res.body.paginaton).to.have.property('totalCount').to.equal(1);
      });
    });
    it('Should throw an error if the searched document is not found', function () {
      var query = 'jk';
      (0, _supertest2.default)(_index2.default).get('/api/v1/search/documents/?q=' + query).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message').to.equal('Document not found');
      });
    });
  });
});