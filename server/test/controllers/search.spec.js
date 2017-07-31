import chai from 'chai';
import request from 'supertest';
import http from 'chai-http';
import server from '../../../index';
import data from './mockData';


process.env.NODE_ENV = 'test';

const expect = chai.expect;
chai.use(http);
let userToken, adminToken, sampleUserToken;
const { admin, fellow } = data;

describe('Search', () => {
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

  describe('/SEARCH/users/?q={name}', () => {
    it('Should return an error if no querystring is provided', () => {
      const query = '';
      request(server)
        .get(`/api/v1/search/users/?q=${query}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.eql('Invalid search input');
        });
    });
    it('Should return a search list response of the required search input',
    () => {
      const query = 'jame';
      request(server)
      .get(`/api/v1/search/users/?q=${query}`)
      .set({ authorization: userToken })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.fullName).to.eql('jame doe');
        expect(res.body.userName).to.eql('testdoe');
      });
    });
  });
  describe('/SEARCH/documents/?q=', () => {
    it('Should return an error if no querystring is provided', () => {
      const query = '';
      request(server)
        .get(`/api/v1/search/document/?q=${query}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('message').to.equal('Invalid search input')
        });
      });
     it('Should return a search list of the required search input', () => {
       const query = 'John';
       request(server)
        .get(`/api/v1/search/documents/?q=${query}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('document');
          expect(res.body.document[0]).to.have.property('title').to.equal('John Doe');
          expect(res.body.document[0]).to.have.property('content').to.equal('eze goes to school');
          expect(res.body).to.have.property('pagination');
          expect(res.body.paginaton).to.have.property('totalCount').to.equal(1);
        });
     });
     it('Should throw an error if the searched document is not found', () => {
       const query = 'jk';
       request(server)
        .get(`/api/v1/search/documents/?q=${query}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message').to.equal('Document not found');
        });
     });
   });
});
