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
/** GET /api/v1/users - search list of users */
.get(_auth2.default.verifyToken, _auth2.default.adminAccess, _search2.default.searchUser);

router.route('/documents')
<<<<<<< HEAD
/** GET /api/documents - Get list of users */
.get(_auth2.default.verifyToken, _auth2.default.adminAccess, _search2.default.searchDocuments);
=======
/** GET /api/v1/search - search list of documents */
.get(_auth2.default.verifyToken, _search2.default.searchDocuments);
>>>>>>> 4f5d186dbe87514d3eeabae2b55811aef05eb4c6

exports.default = router;