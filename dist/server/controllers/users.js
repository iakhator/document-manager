'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(req, res) {
  return res.json({ ok: 'none' });
}

function create(req, res) {}

exports.default = { get: get, create: create };