import helper from '../helpers/pagination';
import models from '../models';

const User = models.User;
const Document = models.Document;
const pagination = helper.paginationMetaData;

/**
 * Create documents for users
 * @param {object} req - document to be created
 * @param {object} res - created document
 * @returns {object} - created document
 */
const createDocument = (req, res) => {
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
          userId: req.decoded.id,
          access: req.body.access || 'public'
        })
      .then(documentCreated => res.status(200).send({
        documentCreated,
        message: 'Document created successfully'
      }))
      .catch(error => res.status(400).send(error));
      }
      return res.status(403).json({
        message: 'Document already exist with this title'
      });
    }).catch(error => res.status(400).send(error));
  }
};

/**
 * Update user document.
 * @param {number} req - request id of the document to be updated
 * @param {object} res - object of the updated document
 * @returns {object} - updated document
 */
const updateDocument = (req, res) => {
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
        return res.status(403).json({
          message: 'You are not authorized to edit this document'
        });
      }
      return document
        .update({
          title: req.body.title || document.title,
          content: req.body.content || document.content,
          access: req.body.access || document.access,
          userId: document.userId
        })
        .then(() => res.status(200).send({
          document,
          message: 'Document updated successfully'
        }))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
};

/**
 *  Get all documents
 * @param {object} req - contains an object of the query, limits and offset
 * @param {array} res - array of documents with pagination
 * @returns {array} - array of documents
 */
const getAllDocument = (req, res) => {
  const limit = req.query.limit || 6;
  const offset = req.query.offset || 0;
  if (req.decoded.roleId === 1) {
    return Document.findAndCountAll({
      limit,
      offset,
      where: {
        $or: [
          {
            access: {
              $eq: 'private'
            }
          },
          {
            access: {
              $eq: 'public'
            }
          },
          {
            access: {
              $eq: 'role'
            }
          }
        ]
      },
      include: [
        {
          model: User,
          attributes: ['userName', 'roleId']
        }
      ]
    })
    .then(({ rows: documents, count }) => {
      res.status(200).send({
        documents,
        pagination: pagination(count, limit, offset),
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
        pagination: pagination(count, limit, offset),
      });
    })
    .catch(error => res.status(400).send(error));
  }
};

/**
   * Find a document by Id
   * @param {number} req - id of the requested document
   * @param {object} res - object containg the requested document
   * @returns {object} requested document
   */
const findDocument = (req, res) => {
  Document.findById(req.params.id)
    .then((document) => {
      if (!document) {
        res.status(404).json({ message: 'Document not found' });
      }
      if (req.decoded.roleId === 1) {
        return res.status(200).send({ document });
      }
      if (document.access === 'public') {
        return res.status(200).send({ document });
      }
      if (document.access === 'private') {
        if (document.userId !== req.decoded.id) {
          return res.status(403).json({
            message: 'You are not authorized to view this document'
          });
        }
        return res.status(200).send({ document });
      }
      if (document.access === 'role') {
        return User
          .findById(document.userId)
          .then((documentOwner) => {
            if (
              Number(documentOwner.roleId) !== Number(req.decoded.roleId)
            ) {
              return res.status(403).json({
                message: 'You are not authorized to view this document'
              });
            }
            return res.status(200).send({ document });
          })
          .catch(error => res.status(400).send(error));
      }
    })
    .catch(() => res.status(400).send({
      message: 'Invalid input specified.'
    }));
};

/**
 * Delete a document by Id
 * @param {number} req - id of the requested document
 * @param {object} res - message
 * @returns {object} - message
 */
const deleteDocument = (req, res) => {
  Document.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          message: 'Document Not Found'
        });
      }
      if (
        req.decoded.roleId !== 1 &&
        Number(document.userId) !== Number(req.decoded.id)
      ) {
        return res.status(403).json({
          message: 'You are not authorized to delete this document'
        });
      }
      return document
        .destroy()
        .then(() => res.status(200).send({
          message: 'Document successfully deleted'
        }))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
};

module.exports = {
  createDocument,
  updateDocument,
  getAllDocument,
  findDocument,
  deleteDocument };
