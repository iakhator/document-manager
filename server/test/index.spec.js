process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

let expect = chai.expect();

chai.use(chaiHttp);
