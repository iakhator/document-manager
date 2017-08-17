import chai from 'chai';
import request from 'supertest';
import server from '../../../index';
import data from './mockData';

const expect = chai.expect;
const superRequest = request(server);
let userToken, adminToken, sampleUserToken;
const { admin, fakeBass, fellow, user1, user2, iakhator, Baas, JohnB } = data;

describe('Users', () => {
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

  describe('/POST User login', () => {
    it('Should fail if the user enters incorrect crendentials upon login',
    (done) => {
      superRequest
        .post('/api/v1/users/login')
        .send(user1)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message)
          .to.eql('Authentication failed. User not found.');
          done();
        });
    });

    it('Should fail if the user provide a wrong password', (done) => {
      superRequest
        .post('/api/v1/users/login')
        .send(user2)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message)
          .to.eql('Authentication failed. Wrong password.');
          done();
        });
    });

    it('should log in a user and return a token', (done) => {
      superRequest
        .post('/api/v1/users/login').send(admin).end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message', 'token']);
          expect(res.body.message).to.eql('You have successfully logged in.');
          done();
        });
    });
  });
  describe('/POST User Signup', () => {
    it('should create a new user', (done) => {
      superRequest
        .post('/api/v1/users/').send(fakeBass).end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body)
            .to.have
            .keys(['message', 'fullName', 'email', 'id', 'roleId']);
          expect(res.body.fullName).to.eql(fakeBass.fullName);
          expect(res.body.email).to.eql(fakeBass.email);
          expect(res.body.message)
          .to.eql('You have successfully registered.');
          done();
        });
    });
  });

  describe('#GET Users', () => {
    it('Should get all users if the user is an admin ', (done) => {
      superRequest
        .get('/api/v1/users')
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys(['user', 'pagination']);
          done();
        });
    });
    it('Should fail to get all users if the user has no admin access ',
    (done) => {
      superRequest
        .get('/api/v1/users')
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('You are not authorized');
          done();
        });
    });
    it('Should fail to get all users if not logged in', (done) => {
      superRequest
        .get('/api/v1/users')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('Please register or login.');
          done();
        });
    });
    it('Should get all users with correct limit as a query', (done) => {
      const limit = 1;
      superRequest
        .get(`/api/v1/users?limit=${limit}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.user[0].fullName).to.equal(Baas.fullName);
          expect(res.body.user[0].userName).to.equal(Baas.userName);
          done();
        });
    });
  });
  describe('#GET User by Id', () => {
    it('Should get a user if the user is an admin', (done) => {
      const id = 2;
      superRequest
        .get(`/api/v1/users/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).be.a('array');
          expect(res.body[0].fullName).to.eql(JohnB.fullName);
          expect(res.body[0].id).to.eql(2);
          expect(res.body[0].userName).to.eql(JohnB.userName);
          expect(res.body[0].email).to.eql(JohnB.email);
          expect(res.body[0].roleId).to.eql(2);
          done();
        });
    });
    it('Should get the user if the requested user is the current user',
    (done) => {
      const id = 2;
      superRequest
        .get(`/api/v1/users/${id}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).be.a('array');
          expect(res.body[0].fullName).to.eql(JohnB.fullName);
          expect(res.body[0].id).eql(2);
          expect(res.body[0].userName).to.eql(JohnB.userName);
          expect(res.body[0].email).to.eql(JohnB.email);
          expect(res.body[0].roleId).to.eql(2);
          done();
        });
    });
    it('Should fail to get a user if an invalid input is entered',
    (done) => {
      const id = 'fddjsdcdjn';
      superRequest
        .get(`/api/v1/users/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('message')
          .to.eql(`invalid input syntax for integer: "${id}"`);
          done();
        });
    });
    it('should fail to get the user if the requester is not the owner',
    (done) => {
      const id = 2;
      superRequest
        .get(`api/users/${id}`)
        .set({ authorization: sampleUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Unauthorized access');
        });
      done();
    });
    it('Should fail to get a user if the user does not exist',
    (done) => {
      const id = 250;
      superRequest
        .get(`/api/v1/users/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('User not found');
          done();
        });
    });
    it('Should fail to get a user if the id is out of range',
    (done) => {
      const id = 500000000000000000;
      superRequest
        .get(`/api/v1/users/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('message')
          .to.equal('out of range');
          done();
        });
    });
  });
  describe('#PUT Update user by Id', () => {
    it('Should update a user`s full name if the user has the same id',
      (done) => {
        const id = 2;
        superRequest
          .put(`/api/v1/users/${id}`)
          .set({ authorization: userToken })
          .send({ fullName: 'jake doe' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a('object');
            expect(res.body.userUpdate.id).to.eql(2);
            expect(res.body.userUpdate.fullName).to.eql('jake doe');
            expect(res.body.message)
            .to.eql('Details successfully updated.');
            done();
          });
      });
    it('Should update a user`s email if the user has the same id', (done) => {
      const id = 2;
      superRequest
        .put(`/api/v1/users/${id}`)
        .set({ authorization: userToken })
        .send({ email: 'jakedoe@andela.com' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.userUpdate.id).to.eql(2);
          expect(res.body.userUpdate.email).to.eql('jakedoe@andela.com');
          done();
        });
    });
    it('Should update a user`s username if the user has the same id',
      (done) => {
        const id = 2;
        superRequest
          .put(`/api/v1/users/${id}`)
          .set({ authorization: userToken })
          .send({ userName: 'jakedoe12' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a('object');
            expect(res.body.userUpdate.id).to.eql(2);
            expect(res.body.userUpdate.userName).to.eql('jakedoe12');
            done();
          });
      });
    it(`Should fail to update a user's
    details if the user does not have the same user id`,
    (done) => {
      const id = 3;
      superRequest
        .put(`/api/v1/users/${id}`)
        .set({ authorization: userToken })
        .send({ email: 'jakedoe@andela.com' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message)
          .to.eql('You are not authorized to update this user');
          done();
        });
    });
  });
  describe('#DELETE /:id Users', () => {
    it('Should delete a user given the user has admin access', (done) => {
      const id = 3;
      superRequest
        .delete(`/api/v1/users/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('Should fail to delete a user if the user has no admin access',
    (done) => {
      const id = 3;
      superRequest
        .delete(`/api/v1/users/${id}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message)
          .to.eql('You are not authorized to perform this operation');
          done();
        });
    });
    it('Should give a User not found if user don\'t exist', (done) => {
      const id = 23;
      superRequest
        .delete(`/api/v1/users/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('User not found');
          done();
        });
    });
  });
  describe('/GET/users/:id/documents Documents', () => {
    it('Should fail to get documents if the user does not exist', (done) => {
      const userId = 9;
      superRequest
        .get(`/api/v1/users/${userId}/documents`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).be.a('object');
          expect(res.body.message).to.eql('User not found');
          done();
        });
    });
    it('Should fail to get documents if there is no token present',
    (done) => {
      const userId = 2;
      superRequest
        .get(`/api/v1/users/${userId}/documents`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).be.a('object');
          expect(res.body.message).to.eql('Please register or login.');
          expect(res.body.success).to.eql(false);
          done();
        });
    });
    it('Should get documents for the user with its unique userId', (done) => {
      const userId = 2;
      superRequest
        .get(`/api/v1/users/${userId}/documents`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).be.a('object');
          expect(res.body.document[1].userId).to.eql(2);
          expect(res.body.document[1].title).to.eql('hey yo!');
          expect(res.body.document[1].content)
          .to.eql('Andela is really fun!!');
          done();
        });
    });
  });
});
