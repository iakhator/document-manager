'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _models2.default.User;
var metaData = _helper2.default.paginationMetaData;

function searchUser(req, res) {
  var searchQuery = req.query.q,
      limit = req.query.limit,
      offset = req.query.offset;
  if (!searchQuery) {
    return res.status(400).json({
      message: 'Invalid search input'
    });
  }
  return User.findAndCountAll({
    limit: limit,
    offset: offset,
    attributes: { exclude: ['password'] },
    where: {
      userName: {
        $like: '%' + searchQuery + '%'
      }
    }
  }).then(function (_ref) {
    var user = _ref.rows,
        count = _ref.count;

    if (count === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).send({
      user: user,
      pagination: metaData(count, limit, offset)
    });
  }).catch(function (error) {
    return res.status(400).send(error);
  });
}

exports.default = { searchUser: searchUser };