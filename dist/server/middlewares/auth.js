'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwtSecret = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  var token = req.headers.authorization || req.headers['x-access-token'];
  if (token) {
    _jsonwebtoken2.default.verify(token, jwtSecret, function (err, decoded) {
      if (err) {
        res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}

function adminAccess(req, res, next) {
  if (req.decoded.roleId === 1) {
    next();
  } else {
    return res.status(401).json({
      message: 'You are not authorized'
    });
  }
}

exports.default = { verifyToken: verifyToken, adminAccess: adminAccess };