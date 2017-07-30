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

describe('Roles', () => {
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

  describe('/POST Role', () => {
    it('should add a new role if the user is an admin', (done) => {
      request(server)
      .post('/api/v1/roles')
      .send({ title: 'boromir' })
      .set({ authorization: adminToken })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Role successfully created');
        expect(res.body).to.have.property('role');
        expect(res.body.role).to.have.property('title').to.equal('boromir');
      });
      done();
    });
    it('should add a new role if the user is an admin', (done) => {
      request(server)
      .post('/api/v1/roles')
      .send({ title: 'king' })
      .set({ authorization: adminToken })
      .end((err, res) => {
        expect(res.status).to.equal(204);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('Role successfully created');
        expect(res.body).to.have.property('role');
      });
      done();
    });
    it('Should fail if a non-admin wants to add a new role', (done) => {
      const role = {
        title: 'boromir-team'
      };
      request(server)
        .post('/api/v1/roles/')
        .set({ authorization: userToken })
      .send(role)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.eql('You are not authorized');
        done();
      });
    });
    it('Should return an error if the title is not a string', (done) => {
      chai.request(server)
        .post('/api/v1/roles')
        .set({ authorization: adminToken })
        .send({ title: 358583 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('Invalid input credentials');
          done();
        });
    });
  });

  describe('/GET Role', () => {
    it('Should get all the roles if the user is an admin', (done) => {
      chai.request(server)
        .get('/api/v1/roles')
        .set({ authorization: adminToken })
        .end((err, res) => {
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
    it('Should fail to get the roles if the user is not admin', (done) => {
      chai.request(server)
        .get('/api/v1/roles')
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message)
          .to.eql('You are not authorized');
          done();
        });
    });
  });

  describe('/GET/:id Role', () => {
    it('Should get a role by id if the user is an admin', (done) => {
      const id = 2;
      chai.request(server)
        .get(`/api/v1/roles/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).be.a('object');
          expect(res.body.title).to.eql('facilitator');
          expect(res.body.id).to.equal(2);
          done();
        });
    });
    it('Should fail to get a role by id if the user is not an admin',
    (done) => {
      const id = 2;
      chai.request(server)
        .get(`/api/v1/roles/${id}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.eql('You are not authorized');
          done();
        });
    });
    it('Should fail to get a role by id if the user enters an invalid input',
    (done) => {
      const id = 'fddjsdcdjn';
      chai.request(server)
        .get(`/api/v1/roles/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message)
          .to.eql(`invalid input syntax for integer: "${id}"`);
          done();
        });
    });
    it('Should fail to get a role by id if the role does not exist', (done) => {
      const id = 250;
      chai.request(server)
        .get(`/api/v1/roles/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.eql('Role not found');
          done();
        });
    });
    it('Should fail to get a role by id if the id is out of range', (done) => {
      const id = 500000000000000000000;
      chai.request(server)
        .get(`/api/v1/roles/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message)
          .to.eql(`value "${id}" is out of range for type integer`);
          done();
        });
    });
  });
  describe('/PUT/:id Role', () => {
    it('Should update a role by id if the user has admin access', (done) => {
      const id = 2;
      chai.request(server)
          .put(`/api/v1/roles/${id}`)
         .set({ authorization: adminToken })
        .send({ title: 'boromir-team' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('Role updated successfully');
          expect(res.body).to.have.property('role');
          done();
        });
    });
    it('Should fail to update a role by id if the user has no admin access',
    (done) => {
      const id = 2;
      chai.request(server)
          .put(`/api/v1/roles/${id}`)
         .set({ authorization: userToken })
        .send({ title: 'kiba' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('You are not authorized');
          done();
        });
    });
    it(`Should fail to update a
       role by id if the admin enters an invalid input`,
      (done) => {
        const id = 200;
        chai.request(server)
          .put(`/api/v1/roles/${id}`)
         .set({ authorization: adminToken })
        .send({ title: 'kiba' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Role not found');
          done();
        });
      });
    it(`Should fail to update a role by
      id if the admin enters an id that is out range`,
      (done) => {
        const id = 2000000000000000;
        chai.request(server)
          .put(`/api/v1/roles/${id}`)
          .set({ authorization: adminToken })
          .send({ title: 'regular' })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.be.a('object');
            expect(res.body.message)
            .to.eql(`value "${id}" is out of range for type integer`);
            done();
          });
      });
  });
  describe('/DELETE/:id Role', () => {
    it('Should delete a role given the user has admin access', (done) => {
      const id = 3;
      chai.request(server)
        .delete(`/api/v1/roles/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(204);
          expect(res.body).to.be.a('object');
        });
      done();
    });
    it('Should fail to delete a role given the user has no admin access',
    (done) => {
      const id = 3;
      chai.request(server)
        .delete(`/api/v1/roles/${id}`)
        .set({ authorization: userToken })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.eql('You are not authorized');
          done();
        });
    });
    it('Should fail to delete a role given the admin enters an invalid input',
    (done) => {
      const id = 300;
      chai.request(server)
        .delete(`/api/v1/roles/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });
    it(`Should fail to delete a role given
      the admin enters an input that is out of range`, (done) => {
      const id = 3000000000000000;
      chai.request(server)
        .delete(`/api/v1/roles/${id}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.message)
          .to.eql(`value "${id}" is out of range for type integer`);
          done();
        });
    });
  });
});
