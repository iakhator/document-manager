'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function get(req, res) {
  return res.json({ ok: 'none' });
}

function create(req, res) {
  return res.json({ create: 'yes' });
}

exports.default = { get: get, create: create };