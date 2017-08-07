import chai from 'chai';
import httpMocks from 'node-mocks-http';
import request from 'supertest';
import server from '../../../index';
import data from '../controllers/mockData';
import auth from '../../middlewares/auth';

const EventEmitter = require('events').EventEmitter;
const expect = chai.expect;

const superRequest = request(server);
let adminToken, userToken;
const { admin, fellow } = data;

describe('Authentication', () => {
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

  describe('VerifyToken', () => {
    it('Should check if the token is provided with request', (done) => {
      const httpRequest = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/documents',
      });
      const response = httpMocks.createResponse();
      const nextCallBack = () => { };
      auth.verifyToken(httpRequest, response, nextCallBack);
      expect(response._getData().message).to.equal('No token provided.');
      done();
    });
    it('Should provide access if the token is provided and valid', (done) => {
      const httpRequest = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/documents',
        headers: { 'x-access-token': adminToken }
      });
      const response = httpMocks.createResponse();
      const nextCallBack = () => { };
      auth.verifyToken(httpRequest, response, nextCallBack);
      expect(response._getData().message).to.equal(undefined);
      done();
    });
    it('Should deny access if the token is invalid', (done) => {
      const httpRequest = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/documents/',
        headers: { 'x-access-token': 'thisisandela' }
      });
      const response = httpMocks.createResponse();
      const nextCallBack = () => { };
      auth.verifyToken(httpRequest, response, nextCallBack);
      response.on('end', () => {
        expect(response._getData().success).to.equal(false);
      });
      done();
    });
  });

  describe('AdminAccess', () => {
    it('Should deny access if the user is not admin', (done) => {
      const httpRequest = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/documents/',
        headers: { 'x-access-token': userToken }
      });
      httpRequest.decoded = { roleId: 2 };
      const response = httpMocks.createResponse();
      const nextCallBack = () => { };
      auth.adminAccess(httpRequest, response, nextCallBack);
      response.on('end', () => {
        expect(response._getData().message).to.equal('You are not authorized');
      });
      done();
    });
    it('Should grant access if the user is an admin', (done) => {
      const httpRequest = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/documents/',
        headers: { 'x-access-token': adminToken }
      });
      httpRequest.decoded = { roleId: 1 };
      const response = httpMocks.createResponse();
      const nextCallBack = () => { };
      auth.adminAccess(httpRequest, response, nextCallBack);
      response.on('end', () => {
        expect(response._getData().message).to.equal(undefined);
      });
      done();
    });
  });
});
