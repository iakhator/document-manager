'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

exports.default = {
  admin: {
    email: 'baas@test.com',
    password: process.env.TEST_ADMIN_PASSWORD
  },
  fellow: {
    email: 'john@test.com',
    password: process.env.TEST_FELLOW_PASSWORD
  },
  faciliatator: {
    email: 'blessing@test.com',
    password: process.env.TEST_FACILITATOR_PASSWORD
  },
  user2: {
    email: 'baas@test.com',
    password: 'test'
  },
  user1: {
    email: 'test@test123.com',
    password: 'test'
  },
  fakeBass: {
    fullName: 'Baasbank Adams',
    userName: 'tiaandela',
    email: 'name@example.com',
    password: 'pass123',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  Baas: {
    fullName: 'Baas Bank',
    userName: 'bank',
    email: 'baas@test.com',
    password: 'pass123',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  fakeUserDetails: {
    fullName: 'Daniel Cfh',
    userName: 'cfh',
    email: 'cfh@example.com',
    password: 'pass123',
    roleId: 2,
    createdAt: 'date',
    updatedAt: new Date()
  }
};