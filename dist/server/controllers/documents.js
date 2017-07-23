'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Document = _models2.default.Document;
var metaData = _helper2.default.paginationMetaData;

exports.default = { searchUser: searchUser };