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
var Document = _models2.default.Document;
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

function searchDocuments(req, res) {
  var limit = req.query.limit,
      offset = req.query.offset,
      queryString = req.query.q;
  if (!queryString) {
    return res.status(400).json({
      message: 'Invalid search input'
    });
  }
  if (req.decoded.roleId === 1) {
    return Document.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        access: {
          $ne: 'private'
        },
        title: {
          $like: '%' + queryString + '%'
        }
      },
      include: [{
        model: User,
        attributes: ['userName', 'roleId']
      }]
    }).then(function (_ref2) {
      var document = _ref2.rows,
          count = _ref2.count;

      if (count === 0) {
        return res.status(404).json({
          message: 'Document not found'
        });
      }
      res.status(200).send({
        document: document,
        pagination: metaData(count, limit, offset)
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  } else if (req.decoded.roleId !== 1) {
    return Document.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [{
        model: User,
        attributes: ['userName', 'roleId'],
        where: {
          roleId: req.decoded.roleId
        }
      }],
      where: {
        access: {
          $ne: 'private'
        },
        title: {
          $like: '%' + queryString + '%'
        }
      }

    }).then(function (_ref3) {
      var document = _ref3.rows,
          count = _ref3.count;

      if (count === 0) {
        return res.status(404).json({
          message: 'Document not found'
        });
      }
      res.status(200).send({
        document: document,
        pagination: metaData(count, limit, offset)
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
}

exports.default = { searchUser: searchUser, searchDocuments: searchDocuments };