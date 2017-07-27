'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _roles = require('../controllers/roles');

var _roles2 = _interopRequireDefault(_roles);

var _auth = require('../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/')
/** GET /api/roles - Get list of roles */
.get(_auth2.default.verifyToken, _auth2.default.adminAccess, _roles2.default.getRoles)

/** POST /api/roles - Create roles */
.post(_auth2.default.verifyToken, _auth2.default.adminAccess, _roles2.default.createRole);

router.route('/:id')
/** GET /api/users/roles - Find roles */
.get(_auth2.default.verifyToken, _auth2.default.adminAccess, _roles2.default.findRole)

/** PUT /api/users/id - update roles */
.put(_auth2.default.verifyToken, _auth2.default.adminAccess, _roles2.default.updateRole)

/** DELETE /api/users/id - delete roles */
.delete(_auth2.default.verifyToken, _auth2.default.adminAccess, _roles2.default.deleteRole);

exports.default = router;