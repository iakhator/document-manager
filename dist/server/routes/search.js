'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _search = require('../controllers/search');

var _search2 = _interopRequireDefault(_search);

var _auth = require('../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/users')
/** GET /api/users - Get list of users */
.get(_auth2.default.verifyToken, _auth2.default.adminAccess, _search2.default.searchUser);

router.route('/documents')
/** GET /api/documents - Get list of users */
.get(_auth2.default.verifyToken, _auth2.default.adminAccess, _search2.default.searchDocuments);

exports.default = router;