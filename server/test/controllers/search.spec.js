import chai from 'chai';
import request from 'supertest';
import server from '../../../index';
import data from './mockData';


const expect = chai.expect;
const superRequest = request(server);
let userToken, adminToken;
const { admin, fellow, Baas } = data;

describe('Search', () => {
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
        done();
      });
  });

  describe('/SEARCH/users/?q={name}', () => {
    it('Should return an error if no querystring is provided', (done) => {
      const query = '';
      superRequest
        .get(`/api/v1/search/users/?q=${query}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.eql('Invalid search input');
          done();
        });
    });
    it('Should return a search list response of the required search input',
    (done) => {
      const query = Baas.userName;
      superRequest
      .get(`/api/v1/search/users/?q=${query}`)
      .set({ authorization: adminToken })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.user[0].fullName).to.eql(Baas.fullName);
        expect(res.body.user[0].userName).to.equal(Baas.userName);
        done();
      });
    });
  });
  describe('/SEARCH/documents/?q=', () => {
    it('Should return an error if no querystring is provided', (done) => {
      const query = '';
      superRequest
        .get(`/api/v1/search/documents/?q=${query}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.eql('Invalid search input');
          done();
        });
    });
    it('Should return a search list of the required search input', (done) => {
      const query = 'John';
      superRequest
        .get(`/api/v1/search/documents/?q=${query}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.document[0].title).to.equal('John Doe');
          expect(res.body.document[0].content).to.equal('eze goes to school');
          expect(res.body).to.have.property('pagination');
          done();
        });
    });
    it('Should throw an error if the searched document is not found',
      (done) => {
        const query = 'jk';
        superRequest
          .get(`/api/v1/search/documents/?q=${query}`)
          .set({ authorization: userToken })
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Search term does not match any document.');
            done();
          });
      });
  });
});
