'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var jwtSecret = process.env.JWT_SECRET;
var User = _models2.default.User;
var metaData = _helper2.default.paginationMetaData;

function getUsers(req, res) {
  var limit = req.query.limit;
  var offset = req.query.offset;
  return User.findAndCountAll({ limit: limit,
    offset: offset,
    attributes: { exclude: ['password'] }
  }).then(function (_ref) {
    var user = _ref.rows,
        count = _ref.count;

    res.status(200).send({
      user: user,
      pagination: metaData(count, limit, offset)
    });
  }).catch(function (error) {
    return res.status(400).send(error);
  });
}

function createUser(req, res) {
  req.check('fullName', 'FullName is required').notEmpty();
  req.check('userName', 'userName is required').notEmpty();
  req.check('email', 'Email is required').notEmpty();
  req.check('email', 'Please put a valid email').isEmail();
  req.check('password', 'Password is required').notEmpty();
  req.check('password', 'Password must be a mininum of 4 character').isLength(4, 50);
  var errors = req.validationErrors();

  if (errors) {
    res.status(400).json({ errors: errors });
  } else {
    _bcrypt2.default.genSalt(10, function (err, salt) {
      _bcrypt2.default.hash(req.body.password, salt, function (err, hash) {
        User.findAll({
          where: { email: req.body.email }
        }).then(function (err, user) {
          if (!user) {
            User.create({
              fullName: req.body.fullName,
              userName: req.body.userName,
              email: req.body.email,
              password: hash,
              roleId: req.body.roleId || 2
            }).then(function (userDetails) {
              res.status(200).json({
                userDetails: userDetails,
                success: 'ok',
                message: 'You have successfully registered.'
              });
            }).catch(function (error) {
              res.status(400).json(error);
            });
          }
        });
      });
    });
  }
}

function login(req, res) {
  req.check('email', 'Email is required').notEmpty();
  req.check('email', 'Please put a valid email').isEmail();
  req.check('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.status(400).json({ errors: errors });
  } else {
    User.findAll({
      where: { email: req.body.email }
    }).then(function (user) {
      var existingUser = user[0];
      if (!existingUser) {
        res.status(400).json({
          success: false,
          message: 'Authentication failed. User not found.' });
      } else if (existingUser) {
        _bcrypt2.default.compare(req.body.password, existingUser.password, function (err, result) {
          if (err) throw err;
          if (result) {
            var payLoad = {
              email: existingUser.email,
              id: existingUser.id,
              fullName: existingUser.fullName,
              roleId: existingUser.roleId
            };
            var token = _jsonwebtoken2.default.sign(payLoad, jwtSecret, {
              expiresIn: 60 * 60 * 24
            });
            res.status(201).json({
              success: true,
              token: token
            });
          } else {
            res.status(401).json({
              success: false,
              message: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
}

function findUser(req, res) {
  var userQuery = Number(req.params.id);
  if (req.decoded.id !== userQuery && req.decoded.roleId !== 1) {
    return res.status(401).json({
      message: 'Unauthorized Access'
    });
  }
  return User.findAll({
    where: {
      id: req.params.id
    },
    attributes: { exclude: ['password'] }
  }).then(function (user) {
    if (!user.length) {
      res.status(404).json({ message: 'User not found' });
    }
    res.status(200).send(user);
  }).catch(function (error) {
    return res.status(400).send(error);
  });
}

function updateUser(req, res) {
  if (Number(req.decoded.id) !== Number(req.params.id)) {
    return res.status(401).json({
      message: 'You are not authorized to access this user'
    });
  }
  var userId = Number(req.params.id);
  _bcrypt2.default.genSalt(10, function (err, salt) {
    _bcrypt2.default.hash(req.body.password, salt, function (err, hash) {
      User.findById(userId).then(function (user) {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return user.update({
          fullName: req.body.fullName || user.fullName,
          userName: req.body.userName || user.userName,
          email: req.body.email || user.email,
          password: hash || user.password,
          roleId: req.body.roleId || user.roleId
        }).then(function (updatedUser) {
          res.status(200).send({
            id: updatedUser.id,
            fullName: updatedUser.fullName,
            userName: updatedUser.userName,
            email: updatedUser.email,
            roleId: updatedUser.roleId
          });
        }).catch(function (error) {
          return res.status(400).send(error);
        });
      }).catch(function (error) {
        return res.status(400).send(error);
      });
    });
  });
}

exports.default = { getUsers: getUsers, createUser: createUser, login: login, findUser: findUser, updateUser: updateUser };