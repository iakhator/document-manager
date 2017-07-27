import helper from '../helpers/helper';
import models from '../models';

const Document = models.Document;
const User = models.User;
const metaData = helper.paginationMetaData;

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

  const errors = req.validationErrors();

  if (errors) {
    res.status(400).json({ errors });
  } else {
    Document.findAll({
      where: {
        title: req.body.title
      }
    }).then((document) => {
      if (document.length === 0) {
        return Document.create({
          title: req.body.title,
          content: req.body.content,
          access: req.body.value,
          userId: req.body.userId
        })
      .then(documentResponse => res.status(201).send(documentResponse))
      .catch(error => res.status(400).send(error));
      }
      return res.status(403).json({
        title: 'Document already exists'
      });
    }).catch(error => res.status(400).send(error));
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
  const docId = Number(req.params.id);
  return Document.findById(docId)
    .then((document) => {
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
      return document
        .update({
          title: req.body.title || document.title,
          content: req.body.content || document.content,
          access: req.body.value || document.access,
          userId: req.body.userId || document.userId
        })
        .then(() => res.status(200).send(document))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

/**
 *  Get all documents
 * @param {object} req - contains an object of the query, limits and offset
 * @param {array} res - array of documents with pagination
 * @returns {array} - array of documents
 */
function getAllDocument(req, res) {
  const limit = req.query.limit;
  const offset = req.query.offset;
  if (req.decoded.roleId === 1) {
    return Document.findAndCountAll({
      limit,
      offset,
      where: {
        access: {
          $ne: 'private'
        }
      },
      include: [
        {
          model: User,
          attributes: ['userName', 'roleId']
        }
      ]
    })
    .then(({ rows: document, count }) => {
      res.status(200).send({
        document,
        pagination: metaData(count, limit, offset),
      });
    })
    .catch(error => res.status(400).send(error));
  } else if (req.decoded.roleId !== 1) {
    return Document.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ['userName', 'roleId'],
          where: {
            roleId: req.decoded.roleId
          },
        },
      ],
      where: {
        access: {
          $ne: 'private'
        }
      },

    })
    .then(({ rows: document, count }) => {
      res.status(200).send({
        document,
        pagination: metaData(count, limit, offset),
      });
    })
    .catch(error => res.status(400).send(error));
  }
}

/**
   * Find a document by Id
   * @param {number} req - id of the requested document
   * @param {object} res - object containg the requested document
   * @returns {object} requested document
   */
function findDocument(req, res) {
  return Document.findById(req.params.id)
    .then((document) => {
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
        return models.User
          .findById(document.userId)
          .then((documentOwner) => {
            if (
              Number(documentOwner.roleId) !== Number(req.decoded.roleId)
            ) {
              return res.status(401).json({
                message: 'You are not authorized to view this document'
              });
            }
            return res.status(200).send(document);
          })
          .catch(error => res.status(400).send(error));
      }
    })
    .catch(error => res.status(400).send(error));
}

/**
 *
 * Delete a document by Id
 * @param {number} req - id of the requested document
 * @param {object} res - message
 * @returns {object} - message
 */
function deleteDocument(req, res) {
  return Document.findById(req.params.id)
    .then((document) => {
      if (!document) {
        res.status(404).json({ message: 'Document not found' });
      }
      if (
        req.decoded.roleId !== 1 &&
        Number(document.userId) !== Number(req.decoded.id)
      ) {
        return res.status(401).json({
          message: 'You are not authorized to delete this document'
        });
      }
      return document
        .destroy()
        .then(() => res.status(204)
          .send({ message: 'Document deleted successfully' }))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

export default {
  createDocument,
  updateDocument,
  getAllDocument,
  findDocument,
  deleteDocument };
