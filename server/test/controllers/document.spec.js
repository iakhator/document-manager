import chai from 'chai';
import request from 'supertest';
import server from '../../../index';
import data from './mockData';

const expect = chai.expect;
const superRequest = request(server);
let userToken, adminToken, sampleUserToken;
const { admin, fellow, iakhator } = data;

describe('Documents', () => {
  before((done) => {
    superRequest
      .post('/api/v1/users/login')
      .send(admin)
        .end((err, res) => {
          adminToken = res.body.token;
        });
    superRequest
      .post('/api/v1/users/login')
      .send(fellow)
      .end((err, res) => {
        userToken = res.body.token;
      });
    superRequest
      .post('/api/v1/users/login')
      .send(iakhator)
      .end((err, res) => {
        sampleUserToken = res.body.token;
        done();
      });
  });

  describe('/POST Document', () => {
    it('should add a new document if the user is authenticated', (done) => {
      superRequest
      .post('/api/v1/documents')
      .send(data.andelaDocument)
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.documentCreated).to.have.property('id');
        expect(res.body.documentCreated.title)
        .to.eql(data.andelaDocument.title);
        expect(res.body.documentCreated.content)
        .to.eql(data.andelaDocument.content);
        expect(res.body.documentCreated.access)
        .to.equal(data.andelaDocument.access);
        expect(res.body.message)
        .to.equal('Document created successfully');
        done();
      });
    });

    it('Should fail if document already exist', () => {
      superRequest
      .post('/api/v1/documents')
      .send(data.andelaDocument)
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.eql('Document already exists');
      });
    });
    it('should fail to add a new document if the user is not authenticated',
    (done) => {
      superRequest
      .post('/api/v1/documents')
      .send(data.boromirOne)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Please register or login.');
        done();
      });
    });
    it('should fail to add a new document if the access field is missing',
    (done) => {
      superRequest
      .post('/api/v1/documents')
      .send(data.boromirAccess)
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.a('object');
        expect(res.body.errors[0].msg).to.be.equal('accessType is required');
        done();
      });
    });
    it('should fail to add a new document if the title field is missing',
    (done) => {
      superRequest
      .post('/api/v1/documents')
      .send(data.boromirTitle)
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.a('object');
        expect(res.body.errors[0].msg).to.be.equal('Title is required');
        done();
      });
    });
    it('should fail to add a new document if the content field is missing',
    (done) => {
      superRequest
      .post('/api/v1/documents')
      .send(data.boromirContent)
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.a('object');
        expect(res.body.errors[0].msg).to.be.equal('Content is required');
        done();
      });
    });
  });

  describe('/GET Documents', () => {
    it('Should get all documents for the user that is authenticated',
    (done) => {
      superRequest
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
      superRequest
      .get('/api/v1/documents/')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).be.eql('Please register or login.');
        expect(res.body.success).to.eql(false);
        done();
      });
    });
    it('Should get all documents with correct limit as a query', (done) => {
      const limit = 1;
      superRequest
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
      superRequest
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
      superRequest
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
      superRequest
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(4);
          expect(res.body.title).to.equal('hey yo!');
          expect(res.body.access).to.equal('public');
          done();
        });
    });
    it('Should fail to get a private document if the requester does not own it',
    (done) => {
      const documentId = 2;
      superRequest
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: sampleUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.message)
          .to.eql('You are not authorized to view this document');
          done();
        });
    });
    it('Should get a private document where the requester is the owner',
    (done) => {
      const documentId = 2;
      superRequest
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.access).to.eql(data.naddDocument.access);
          expect(res.body.title).to.eql(data.naddDocument.title);
          expect(res.body.id).to.eql(2);
          expect(res.body.userId).to.eql(2);
          done();
        });
    });
    it('Should fail get a role document if the users are not on the same role',
    (done) => {
      const documentId = 3;
      superRequest
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: sampleUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.message)
          .to.eql('You are not authorized to view this document');
          done();
        });
    });
    it('Should get a role document if the users are on the same role',
    (done) => {
      const documentId = 3;
      superRequest
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(3);
          expect(res.body.title).to.eql(data.hannDocument.title);
          expect(res.body.access).to.eql('role');
          done();
        });
    });
    it('Should get a role document if the user is an admin', (done) => {
      const documentId = 3;
      superRequest
        .get(`/api/v1/documents/${documentId}/`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.eql(3);
          expect(res.body.title).to.eql(data.hannDocument.title);
          expect(res.body.access).to.eql('role');
        });
      done();
    });
  });

  describe('/PUT/:id, Document', () => {
    it('Should update a document by id if the user has the same id',
      (done) => {
        const id = 2;
        superRequest
          .put(`/api/v1/documents/${id}`)
          .set({ authorization: userToken })
          .send({ title: 'wreck it ralph' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a('object');
            expect(res.body.document.id).to.eql(2);
            expect(res.body.document.title).to.eql('wreck it ralph');
            expect(res.body.message).to.eql('Document updated successfully');
            done();
          });
      });
    it(`Should fail to update a document by
      id if the user does not have the same id`,
      (done) => {
        const id = 2;
        superRequest
          .put(`/api/v1/documents/${id}`)
          .set({ authorization: sampleUserToken })
          .send({ title: 'spiderman Homecoming' })
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body).to.be.a('object');
            expect(res.body.message)
            .to.eql('You are not authorized to edit this document');
            done();
          });
      });
    it('Should not update a document by id if the user has admin access',
      (done) => {
        const id = 2;
        superRequest
          .put(`/api/v1/documents/${id}`)
          .set({ authorization: adminToken })
          .send({ title: 'wreck it' })
          .end((err, res) => {
            expect(res.status).to.equal(403);
            done();
          });
      });
    it('Should fail to update a document by id if the document does not exist',
      (done) => {
        const id = 10;
        superRequest
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
      superRequest
        .delete(`/api/v1/documents/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('Should delete a document if the user is the owner', (done) => {
      const id = 2;
      superRequest
        .delete(`/api/v1/documents/${id}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('Should fail to delete the document given the user is not the owner',
    (done) => {
      const id = 1;
      superRequest
        .delete(`/api/v1/documents/${id}`)
        .set({ authorization: sampleUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.message)
          .to.eql('You are not authorized to delete this document');
          done();
        });
    });
    it('Should fail to delete if the document does not exist', (done) => {
      const id = 234;
      superRequest
        .delete(`/api/v1/documents/${id}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('Document Not Found');
          done();
        });
    });
  });
});
