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
var Document = _models2.default.Document;
var User = _models2.default.User;
var metaData = _helper2.default.paginationMetaData;

/**
 * Get all users
 * @param {number} req - limit and offset for getting all user
 * @param {array} res - array of users or error
 * @returns {array} - an array of users
 */
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

/**
 * Create a user
 * @param {object} req - request from user
 * @param {object} res - newly created user or error
 * @returns {object} - an object of a created user
 */
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
    User.findAll({
      where: { email: req.body.email }
    }).then(function (err, user) {
      if (!user) {
        User.create({
          fullName: req.body.fullName,
          userName: req.body.userName,
          email: req.body.email,
          password: _bcrypt2.default.hashSync(req.body.password, _bcrypt2.default.genSaltSync(10)),
          roleId: req.body.roleId || 2
        }).then(function (userDetails) {
          res.status(200).json({
            userDetails: userDetails,
            success: true,
            message: 'You have successfully registered.'
          });
        }).catch(function (error) {
          res.status(400).json(error);
        });
      }
    });
  }
}

/**
 * Log In user with JWT
 * @param {object} req - request from log in user
 * @param {object} res - authenicated user details
 * @returns {object} - an object of the logged in user and a token
 */
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
        if (_bcrypt2.default.compareSync(req.body.password, existingUser.password)) {
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
      }
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
}

/**
 * Find a user by Id
 * @param {number} req - request for user using the id of the user
 * @param {object} res - an object of the user(s) found or error
 * @returns {object} - an object of found user
 */
function findUser(req, res) {
  var userQuery = Number(req.params.id);
  if (req.decoded.id !== userQuery && req.decoded.roleId !== 1) {
    return res.status(401).json({
      message: 'Unauthorized Access'
    });
  }
  if (isNaN(userQuery)) {
    return res.status(401).json({
      message: 'invalid input syntax for integer: "' + req.params.id + '"'
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
  }).catch(function () {
    return res.status(400).send({
      message: 'out of range'
    });
  });
}

/**
 *Update a user by Id
 * @param {object} req - updated user object
 * @param {object} res - updated user object or error
 * @returns {object} - return an object of the updated user
 */
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
            roleId: updatedUser.roleId,
            message: 'Details successfully updated.'
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

/**
 * Delete a user by Id
 * @param {number} req - delete user with an id
 * @param {object} res - message
 * @returns {object} - null
 */
function deleteUser(req, res) {
  if (req.decoded.roleId !== 1) {
    return res.status(401).json({
      message: 'You are not authorized to access this field'
    });
  }
  return User.findById(req.params.id).then(function (user) {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return user.destroy().then(function () {
      return res.status(204).json({
        message: 'User has been deleted successfully' });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }).catch(function (error) {
    return res.status(400).send(error);
  });
}

/**
 * Get documents for specific user
 * @param {object} req - request object containing limit query and offset
 * @param {array} res - array of documents for the requested user
 * @return {array} - array of requested user's document
 */
function getUserDocuments(req, res) {
  var limit = req.query.limit;
  var offset = req.query.offset;
  User.findById(req.params.id).then(function (user) {
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    return Document.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        userId: user.id
      }
    }).then(function (_ref2) {
      var document = _ref2.rows,
          count = _ref2.count;

      res.status(200).send({
        document: document,
        pagination: metaData(count, limit, offset)
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }).catch(function (error) {
    return res.status(400).send(error);
  });
}

exports.default = {
  getUsers: getUsers,
  createUser: createUser,
  login: login,
  findUser: findUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUserDocuments: getUserDocuments
};