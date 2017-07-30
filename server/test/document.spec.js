import chai from 'chai';
import request from 'supertest';
import http from 'chai-http';
import server from '../../index';
import models from '../models';
import data from './mockData';

const expect = chai.expect;
chai.use(http);
let userToken, adminToken, sampleUserToken;
const { admin, fellow } = data;

describe('Documents', () => {
  before((done) => {
    request(server)
      .post('/api/v1/users/login')
      .send(admin)
        .end((err, res) => {
          adminToken = res.body.token;
          done();
        });
  });
  before((done) => {
    request(server)
      .post('/api/v1/users/login')
      .send(fellow)
      .end((err, res) => {
        userToken = res.body.token;
        done();
      });
  });
  before((done) => {
    request(server)
      .post('/api/v1/users/login')
      .send({ email: 'blessing@test.com', password: 'pass123' })
      .end((err, res) => {
        sampleUserToken = res.body.token;
        done();
      });
  });
  after((done) => {
    models.User.destroy({ where: { id: { $notIn: [1, 2, 3] } } });
    done();
  });

  describe('/POST Document', () => {
    it('should add a new document if the user is authenticated', (done) => {
      const document = {
        title: 'boromir-team',
        content: 'Andela is really awesome!!!',
        access: 'public',
        userId: 2,
      };
      request(server)
      .post('/api/v1/documents')
      .send(document)
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('id');
        expect(res.body.title).to.eql('boromir-team');
        expect(res.body.content).to.eql('Andela is really awesome!!!');
        expect(res.body.access).to.equal('public');
        done();
      });
    });

    it('Should fail if document already exist', () => {
      const document = {
        title: 'John team',
        content: 'eze goes to school',
        access: 'public',
      };
      request(server)
      .post('/api/v1/documents')
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.eql('Document already exists');
      });
    });
    it('should fail to add a new document if the user is not authenticated',
    (done) => {
      const document = {
        title: 'boromir-team',
        content: 'Andela is really awesome !!!',
        value: 'private',
        userId: 2,
      };
      request(server)
      .post('/api/v1/documents')
      .send(document)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('No token provided.');
        done();
      });
    });
  });

  describe('/GET Documents', () => {
    it('Should get all documents for the user that is authenticated',
    (done) => {
      request(server)
      .get('/api/v1/documents')
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.keys(['document', 'pagination']);
        done();
      });
    });
    it('should fail to get all documents if the user is not authenticated',
    (done) => {
      request(server)
      .get('/api/v1/documents/')
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.a('object');
        expect(res.body.message).be.eql('No token provided.');
        expect(res.body.success).to.eql(false);
        done();
      });
    });
    it('Should get all documents with correct limit as a query', (done) => {
      const limit = 1;
      request(server)
        .get(`/api/v1/documents?limit=${limit}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          done();
        });
    });
    it('Should get all documents with correct offset as a query', (done) => {
      const offset = 0;
      request(server)
        .get(`/api/v1/documents?limit=${offset}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          done();
        });
    });
  });

  describe('/GET/:id Document', () => {
    it('Should fail to get document if it doesn`t exist', (done) => {
      const documentId = 8;
      request(server)
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('Document not found');
          done();
        });
    });
    it('Should get all public regardless of id', (done) => {
      const documentId = 4;
      request(server)
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(4);
          expect(res.body.title).to.equal('boromir-team');
          expect(res.body.access).to.equal('public');
          done();
        });
    });
    it('Should fail to get a private document if the requester does not own it',
    (done) => {
      const documentId = 2;
      request(server)
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: sampleUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message)
          .to.eql('You are not authorized to view this document');
          done();
        });
    });
    it('Should get a private document the where the requester is the owner',
    (done) => {
      const documentId = 2;
      request(server)
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.access).to.eql('private');
          expect(res.body.title).to.eql('John naddddd');
          expect(res.body.id).to.eql(2);
          expect(res.body.userId).to.eql(2);
          done();
        });
    });
    it('Should fail get a role document if the users are not on the same role',
    (done) => {
      const documentId = 3;
      request(server)
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: sampleUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message)
          .to.eql('You are not authorized to view this document');
          done();
        });
    });
    it('Should get a role document if the users are on the same role',
    (done) => {
      const documentId = 3;
      request(server)
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(3);
          expect(res.body.title).to.eql('James Hannn');
          expect(res.body.access).to.eql('role');
          done();
        });
    });
    it('Should get a role document if the user is an admin', (done) => {
      const documentId = 3;
      request(server)
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(3);
          expect(res.body.title).to.eql('James Hannn');
          expect(res.body.access).to.eql('role');
        });
      done();
    });
  });

  describe('/PUT/:id, Document', () => {
    it('Should update a document by id if the user has the same id',
      (done) => {
        const id = 2;
        request(server)
          .put(`/api/v1/documents/${id}`)
          .set({ authorization: userToken })
          .send({ title: 'wreck it ralph' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a('object');
            expect(res.body.id).to.eql(2);
            expect(res.body.title).to.eql('wreck it ralph');
            done();
          });
      });
    it(`Should fail to update a document by
      id if the user does not have the same id`,
      (done) => {
        const id = 2;
        request(server)
          .put(`/api/v1/documents/${id}`)
          .set({ authorization: sampleUserToken })
          .send({ title: 'spiderman Homecoming' })
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.be.a('object');
            expect(res.body.message)
            .to.eql('You are not authorized to edit this document');
            done();
          });
      });
    it('Should not update a document by id if the user has admin access',
      (done) => {
        const id = 2;
        request(server)
          .put(`/api/v1/documents/${id}`)
          .set({ authorization: adminToken })
          .send({ title: 'wreck it' })
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          });
      });
    it('Should fail to update a document by id if the document does not exist',
      (done) => {
        const id = 10;
        request(server)
        .put(`/api/v1/documents/${id}`)
        .set({ authorization: userToken })
        .send({ title: 'Deadpool' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('Document Not Found');
          done();
        });
      });
  });

  describe('DELETE/:id Document', () => {
    it('Should delete a document if the user has admin access', (done) => {
      const id = 3;
      request(server)
        .delete(`/api/v1/documents/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });
    it('Should delete a document if the user is the owner', (done) => {
      const id = 2;
      request(server)
        .delete(`/api/v1/documents/${id}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });
    it('Should fail to delete the document given the user is not the owner',
    (done) => {
      const id = 1;
      chai.request(server)
        .delete(`/api/v1/documents/${id}`)
        .set({ authorization: sampleUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message)
          .to.eql('You are not authorized to delete this document');
          done();
        });
    });
    it('Should fail to delete if the document does not exist', (done) => {
      const id = 234;
      chai.request(server)
        .delete(`/api/v1/documents/${id}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('Document not found');
          done();
        });
    });
  });
});
