'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _models2.default.User;
var Document = _models2.default.Document;
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

function getAllDocument(req, res) {
  var limit = req.query.limit;
  var offset = req.query.offset;
  if (req.decoded.roleId === 1) {
    return Document.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        access: {
          $ne: 'private'
        }
      },
      include: [{
        model: User,
        attributes: ['userName', 'roleId']
      }]
    }).then(function (_ref) {
      var document = _ref.rows,
          count = _ref.count;

      res.status(200).send({
        document: document,
        pagination: metaData(count, limit, offset)
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  } else if (req.decoded.roleId !== 1) {
    return Document.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [{
        model: User,
        attributes: ['userName', 'roleId'],
        where: {
          roleId: req.decoded.roleId
        }
      }],
      where: {
        access: {
          $ne: 'private'
        }
      }

    }).then(function (_ref2) {
      var document = _ref2.rows,
          count = _ref2.count;

      res.status(200).send({
        document: document,
        pagination: metaData(count, limit, offset)
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
}

function findDocument(req, res) {
  return Document.findById(req.params.id).then(function (document) {
    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }
    if (req.decoded.roleId === 1) {
      return res.json(document);
    }
    if (document.access === 'public') {
      res.status(200).send(document);
    }
    if (document.access === 'private') {
      if (document.userId !== req.decoded.id) {
        res.status(401).json({
          message: 'You are not authorized to view this document'
        });
      }
      return res.status(200).send(document);
    }
    if (document.access === 'role') {
      return _models2.default.User.findById(document.userId).then(function (documentAuthor) {
        if (Number(documentAuthor.roleId) !== Number(req.decoded.roleId)) {
          return res.status(401).json({
            message: 'You are not authorized to view this document'
          });
        }
        return res.status(200).send(document);
      }).catch(function (error) {
        return res.status(400).send(error);
      });
    }
  }).catch(function (error) {
    return res.status(400).send(error);
  });
}

function deleteDocument(req, res) {
  return Document.findById(req.params.id).then(function (document) {
    if (!document) {
      return res.status(404).send({
        message: 'Document Not Found'
      });
    }
    if (req.decoded.roleId !== 1 && Number(document.userId) !== Number(req.decoded.id)) {
      return res.status(401).json({
        message: 'You are not authorized to delete this document'
      });
    }
    return document.destroy().then(function () {
      return res.status(204).send({
        message: 'Document successfully deleted'
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }).catch(function (error) {
    return res.status(400).send(error);
  });
}

exports.default = {
  createDocument: createDocument,
  updateDocument: updateDocument,
  getAllDocument: getAllDocument,
  findDocument: findDocument,
  deleteDocument: deleteDocument
};