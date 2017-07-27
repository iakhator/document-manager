'use strict';

var _express = require('./server/config/express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 3000;

module.exports = _express2.default.listen(port, function () {
  console.log('API Server started and listening on port 3000');
});