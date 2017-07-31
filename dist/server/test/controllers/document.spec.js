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
    fellow = _mockData2.default.fellow;


describe('Documents', function () {
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

  describe('/POST Document', function () {
    it('should add a new document if the user is authenticated', function (done) {
      var document = {
        title: 'hey yo!',
        content: 'Andela is really fun!!',
        access: 'public',
        userId: 2
      };
      (0, _supertest2.default)(_index2.default).post('/api/v1/documents').send(document).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('id');
        expect(res.body.title).to.eql('hey yo!');
        expect(res.body.content).to.eql('Andela is really fun!!');
        expect(res.body.access).to.equal('public');
        done();
      });
    });

    it('Should fail if document already exist', function () {
      var document = {
        title: 'John team',
        content: 'eze goes to school',
        access: 'public'
      };
      (0, _supertest2.default)(_index2.default).post('/api/v1/documents').set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.eql('Document already exists');
      });
    });
    it('should fail to add a new document if the user is not authenticated', function (done) {
      var document = {
        title: 'boromir-team',
        content: 'Andela is really awesome !!!',
        value: 'private',
        userId: 2
      };
      (0, _supertest2.default)(_index2.default).post('/api/v1/documents').send(document).end(function (err, res) {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('No token provided.');
        done();
      });
    });
    it('should fail to add a new document if the value field is missing', function (done) {
      var document = {
        title: 'kiba-team',
        content: 'Andela is really awesome!!!',
        access: '',
        userId: 1
      };
      _chai2.default.request(_index2.default).post('/api/v1/documents').send(document).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.be.equal('accessType is required');
        done();
      });
    });
  });

  describe('/GET Documents', function () {
    it('Should get all documents for the user that is authenticated', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents').set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.keys(['document', 'pagination']);
        done();
      });
    });
    it('should fail to get all documents if the user is not authenticated', function (done) {
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents/').end(function (err, res) {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.a('object');
        expect(res.body.message).be.eql('No token provided.');
        expect(res.body.success).to.eql(false);
        done();
      });
    });
    it('Should get all documents with correct limit as a query', function (done) {
      var limit = 1;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents?limit=' + limit).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        done();
      });
    });
    it('Should get all documents with correct offset as a query', function (done) {
      var offset = 0;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents?limit=' + offset).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });

  describe('/GET/:id Document', function () {
    it('Should fail to get document if it doesn`t exist', function (done) {
      var documentId = 8;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents/' + documentId + '/').set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Document not found');
        done();
      });
    });
    it('Should get all public regardless of id', function (done) {
      var documentId = 4;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents/' + documentId + '/').set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.eql(4);
        expect(res.body.title).to.equal('hey yo!');
        expect(res.body.access).to.equal('public');
        done();
      });
    });
    it('Should fail to get a private document if the requester does not own it', function (done) {
      var documentId = 2;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents/' + documentId + '/').set({ authorization: sampleUserToken }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('You are not authorized to view this document');
        done();
      });
    });
    it('Should get a private document the where the requester is the owner', function (done) {
      var documentId = 2;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents/' + documentId + '/').set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.access).to.eql('private');
        expect(res.body.title).to.eql('John naddddd');
        expect(res.body.id).to.eql(2);
        expect(res.body.userId).to.eql(2);
        done();
      });
    });
    it('Should fail get a role document if the users are not on the same role', function (done) {
      var documentId = 3;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents/' + documentId + '/').set({ authorization: sampleUserToken }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('You are not authorized to view this document');
        done();
      });
    });
    it('Should get a role document if the users are on the same role', function (done) {
      var documentId = 3;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents/' + documentId + '/').set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.eql(3);
        expect(res.body.title).to.eql('James Hannn');
        expect(res.body.access).to.eql('role');
        done();
      });
    });
    it('Should get a role document if the user is an admin', function (done) {
      var documentId = 3;
      (0, _supertest2.default)(_index2.default).get('/api/v1/documents/' + documentId + '/').set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.eql(3);
        expect(res.body.title).to.eql('James Hannn');
        expect(res.body.access).to.eql('role');
      });
      done();
    });
  });

  describe('/PUT/:id, Document', function () {
    it('Should update a document by id if the user has the same id', function (done) {
      var id = 2;
      (0, _supertest2.default)(_index2.default).put('/api/v1/documents/' + id).set({ authorization: userToken }).send({ title: 'wreck it ralph' }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.eql(2);
        expect(res.body.title).to.eql('wreck it ralph');
        done();
      });
    });
    it('Should fail to update a document by\n      id if the user does not have the same id', function (done) {
      var id = 2;
      (0, _supertest2.default)(_index2.default).put('/api/v1/documents/' + id).set({ authorization: sampleUserToken }).send({ title: 'spiderman Homecoming' }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('You are not authorized to edit this document');
        done();
      });
    });
    it('Should not update a document by id if the user has admin access', function (done) {
      var id = 2;
      (0, _supertest2.default)(_index2.default).put('/api/v1/documents/' + id).set({ authorization: adminToken }).send({ title: 'wreck it' }).end(function (err, res) {
        expect(res.status).to.equal(401);
        done();
      });
    });
    it('Should fail to update a document by id if the document does not exist', function (done) {
      var id = 10;
      (0, _supertest2.default)(_index2.default).put('/api/v1/documents/' + id).set({ authorization: userToken }).send({ title: 'Deadpool' }).end(function (err, res) {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Document Not Found');
        done();
      });
    });
  });

  describe('DELETE/:id Document', function () {
    it('Should delete a document if the user has admin access', function (done) {
      var id = 3;
      (0, _supertest2.default)(_index2.default).delete('/api/v1/documents/' + id).set({ authorization: adminToken }).end(function (err, res) {
        expect(res.status).to.equal(204);
        done();
      });
    });
    it('Should delete a document if the user is the owner', function (done) {
      var id = 2;
      (0, _supertest2.default)(_index2.default).delete('/api/v1/documents/' + id).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(204);
        done();
      });
    });
    it('Should fail to delete the document given the user is not the owner', function (done) {
      var id = 1;
      _chai2.default.request(_index2.default).delete('/api/v1/documents/' + id).set({ authorization: sampleUserToken }).end(function (err, res) {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('You are not authorized to delete this document');
        done();
      });
    });
    it('Should fail to delete if the document does not exist', function (done) {
      var id = 234;
      _chai2.default.request(_index2.default).delete('/api/v1/documents/' + id).set({ authorization: userToken }).end(function (err, res) {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Document Not Found');
        done();
      });
    });
  });
});