import helper from '../helpers/helper';
import models from '../models';

const Document = models.Document;
const User = models.User;
const metaData = helper.paginationMetaData;

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

export default { createDocument, updateDocument };
