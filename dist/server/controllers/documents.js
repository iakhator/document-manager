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

/**
 * Create documents for users
 * @param {object} req - document to be created
 * @param {object} res - created document
 * @returns {object} - created document
 */
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
          return res.status(200).send(documentResponse);
        }).catch(function (error) {
          return res.status(400).send(error);
        });
      }
      return res.status(403).json({
        message: 'Document already exists'
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
}

/**
 * Update user document.
 * @param {number} req - request id of the document to be updated
 * @param {object} res - object of the updated document
 * @returns {object} - updated document
 */
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

/**
 *  Get all documents
 * @param {object} req - contains an object of the query, limits and offset
 * @param {array} res - array of documents with pagination
 * @returns {array} - array of documents
 */
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

/**
   * Find a document by Id
   * @param {number} req - id of the requested document
   * @param {object} res - object containg the requested document
   * @returns {object} requested document
   */
function findDocument(req, res) {
  return Document.findById(req.params.id).then(function (document) {
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
    }
    if (req.decoded.roleId === 1) {
      return document;
    }
    if (document.access === 'public') {
      return res.status(200).send(document);
    }
    if (document.access === 'private') {
      if (document.userId !== req.decoded.id) {
        return res.status(401).json({
          message: 'You are not authorized to view this document'
        });
      }
      return res.status(200).send(document);
    }
    if (document.access === 'role') {
      return _models2.default.User.findById(document.userId).then(function (documentOwner) {
        if (Number(documentOwner.roleId) !== Number(req.decoded.roleId)) {
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

/**
 * Delete a document by Id
 * @param {number} req - id of the requested document
 * @param {object} res - message
 * @returns {object} - message
 */
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
  deleteDocument: deleteDocument };