'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _documents = require('../controllers/documents');

var _documents2 = _interopRequireDefault(_documents);

var _auth = require('../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/')
/** GET /api/v1/documents - Get all documents */
.get(_auth2.default.verifyToken, _documents2.default.getAllDocument)

/** POST /api/v1/documents - Create document */
.post(_auth2.default.verifyToken, _documents2.default.createDocument);

router.route('/:id')
/** PUT /api/v1/documents/id - Create document */
.put(_auth2.default.verifyToken, _documents2.default.updateDocument);

exports.default = router;