import helper from '../helpers/helper';
import models from '../models';

const Document = models.Document;
const User = models.User;
const pagination = helper.paginationMetaData;

/**
 * Search for user using a query string
 * @param {string} req - search query of string
 * @param {array} res - array of users
 * @returns {array} - array users searched
 */
function searchUser(req, res) {
  const searchQuery = req.query.q,
    limit = req.query.limit || 6,
    offset = req.query.offset || 0;
  if (!searchQuery) {
    return res.status(400).json({
      message: 'Invalid search input'
    });
  }
  return User
  .findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ['password'] },
    where: {
      userName: {
        $iLike: `%${searchQuery}%`,
      }
    }
  }).then(({ rows: user, count }) => {
    if (count === 0) {
      return res.status(404)
      .json({ message: 'Search term does not match any user' });
    }
    res.status(200).send({
      user,
      pagination: pagination(count, limit, offset)
    });
  }).catch(error => res.status(400).send(error));
}

/**
   *
   * Search for documents by title
   * @param {string} req - an object containing the query, offset and limit
   * @param {array} res - an array containing searched document
   * @returns {array} - searched document
   */
function searchDocuments(req, res) {
  const limit = req.query.limit || 6,
    offset = req.query.offset || 0,
    queryString = req.query.q.replace(/ +(?= )/g, ''),
    splitString = queryString.trim().split(' ');

  const searchQuery = [];
  splitString.forEach((query) => {
    const output = { $iLike: `%${query}%` };
    searchQuery.push(output);
  });


  if (!queryString) {
    return res.status(400).json({
      message: 'Invalid search input'
    });
  }
  if (req.decoded.roleId === 1) {
    return Document.findAndCountAll({
      limit,
      offset,
      where: {
        title: {
          $or: searchQuery
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
      if (count === 0) {
        return res.status(404).json({
          message: 'Search term does not match any document.'
        });
      }
      res.status(200).send({
        document,
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
            roleId: req.decoded.roleId,
          },
        },
      ],
      where: {
        access: {
          $ne: 'private'
        },
        title: {
          $or: searchQuery
        }
      },

    })
    .then(({ rows: document, count }) => {
      if (count === 0) {
        return res.status(404).json({
          message: 'Search term does not match any document.'
        });
      }
      res.status(200).send({
        document,
        pagination: pagination(count, limit, offset),
      });
    })
    .catch(error => res.status(400).send(error));
  }
}

export default { searchUser, searchDocuments };
