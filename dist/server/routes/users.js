'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _users = require('../controllers/users');

var _users2 = _interopRequireDefault(_users);

var _auth = require('../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/')
/** GET /api/users - Get list of users */
.get(_auth2.default.verifyToken, _auth2.default.adminAccess, _users2.default.getUsers)

/** POST /api/users - Create/Signup users */
.post(_users2.default.createUser);

router.route('/login')
/** POST /api/users/login - Login users */
.post(_users2.default.login);

exports.default = router;