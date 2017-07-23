'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Document = _models2.default.Document;
var User = _models2.default.User;
var metaData = _helper2.default.paginationMetaData;

function createDocument(req, res) {
  req.check('title', 'Title is required').notEmpty();
  req.check('content', 'Content is required').notEmpty();
  req.check('access', 'accessType is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.status(400).json({ errors: errors });
  } else {
    Document.findAll({
      where: {
        title: req.body.title
      }
    }).then(function (document) {
      if (document.length === 0) {
        return Document.create({
          title: req.body.title,
          content: req.body.content,
          access: req.body.value,
          userId: req.body.userId
        }).then(function (documentResponse) {
          return res.status(201).send(documentResponse);
        }).catch(function (error) {
          return res.status(400).send(error);
        });
      }
      return res.status(403).json({
        title: 'Document already exists'
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
}

function updateDocument(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400);
  }
  var docId = Number(req.params.id);
  return Document.findById(docId).then(function (document) {
    if (!document) {
      return res.status(404).send({
        message: 'Document Not Found'
      });
    }
    if (Number(document.userId) !== Number(req.decoded.id)) {
      return res.status(401).json({
        message: 'You are not authorized to edit this document'
      });
    }
    return document.update({
      title: req.body.title || document.title,
      content: req.body.content || document.content,
      access: req.body.value || document.access,
      userId: req.body.userId || document.userId
    }).then(function () {
      return res.status(200).send(document);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }).catch(function (error) {
    return res.status(400).send(error);
  });
}

exports.default = { createDocument: createDocument, updateDocument: updateDocument };