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

export default { createDocument };
