'use strict';

process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../index');

var expect = chai.expect();

chai.use(chaiHttp);