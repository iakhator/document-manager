'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _models2.default.User;

function get(req, res) {
  return res.json({ ok: 'none' });
}

function create(req, res) {
  req.check('fullName', 'FullName is required').notEmpty();
  req.check('userName', 'userName is required').notEmpty();
  req.check('email', 'FullName is required').notEmpty();
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
  res.send('login page');
}

exports.default = { get: get, create: create, login: login };