import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import helper from '../helpers/helper';
import models from '../models';

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const Document = models.Document;
const User = models.User;
const pagination = helper.paginationMetaData;

/**
 * Get all users
 * @param {number} req - limit and offset for getting all user
 * @param {array} res - array of users or error
 * @returns {array} - an array of users
 */
function getUsers(req, res) {
  const limit = req.query.limit;
  const offset = req.query.offset;
  return User
  .findAndCountAll(
    { limit,
      offset,
      attributes: { exclude: ['password'] }
    })
  .then(({ rows: user, count }) => {
    res.status(200).send({
      user,
      pagination: pagination(count, limit, offset)
    });
  })
  .catch(error => res.status(400).send(error));
}

/**
 * Create a user
 * @param {object} req - request from user
 * @param {object} res - newly created user or error
 * @returns {object} - an object of a created user
 */
function createUser(req, res) {
  req.check('fullName', 'FullName is required').notEmpty();
  req.check('userName', 'userName is required').notEmpty();
  req.check('email', 'Email is required').notEmpty();
  req.check('email', 'Please put a valid email').isEmail();
  req.check('password', 'Password is required').notEmpty();
  req.check('password', 'Password must be a mininum of 4 character')
  .isLength(4, 50);
  const errors = req.validationErrors();

  if (errors) {
    res.status(400).json({ errors });
  } else {
    User.findAll({
      where: { email: req.body.email }
    }).then((err, user) => {
      if (!user) {
        User.create({
          fullName: req.body.fullName,
          userName: req.body.userName,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
          roleId: req.body.roleId || 2
        }).then((userDetails) => {
          res.status(200).json({
            email: userDetails.email,
            fullName: userDetails.fullName,
            id: userDetails.id,
            roleId: userDetails.roleId,
            message: 'You have successfully registered.'
          });
        }).catch((error) => {
          res.status(400).json(error);
        });
      }
    });
  }
}

/**
 * Log In user with JWT
 * @param {object} req - request from log in user
 * @param {object} res - authenicated user details
 * @returns {object} - an object of the logged in user and a token
 */
function login(req, res) {
  req.check('email', 'Email is required').notEmpty();
  req.check('email', 'Please put a valid email').isEmail();
  req.check('password', 'Password is required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.status(400).json({ errors });
  } else {
    User.findAll({
      where: { email: req.body.email }
    })
    .then((user) => {
      const existingUser = user[0];
      if (!existingUser) {
        res.status(400).json({
          success: false,
          message: 'Authentication failed. User not found.' });
      } else if (existingUser) {
        if (bcrypt.compareSync(req.body.password, existingUser.password)) {
          const payLoad = (
            {
              email: existingUser.email,
              id: existingUser.id,
              fullName: existingUser.fullName,
              roleId: existingUser.roleId,
            }
          );
          const token = jwt.sign(payLoad, jwtSecret, {
            expiresIn: 60 * 60 * 24
          });
          res.status(201).json({
            success: true,
            token,
          });
        } else {
          res.status(401).json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        }
      }
    }).catch(error => res.status(400).send(error));
  }
}

/**
 * Find a user by Id
 * @param {number} req - request for user using the id of the user
 * @param {object} res - an object of the user(s) found or error
 * @returns {object} - an object of found user
 */
function findUser(req, res) {
  const userQuery = Number(req.params.id);
  if ((req.decoded.id !== userQuery) && (req.decoded.roleId !== 1)) {
    return res.status(403).json({
      message: 'Unauthorized Access'
    });
  }
  if (isNaN(userQuery)) {
    return res.status(400).json({
      message: `invalid input syntax for integer: "${req.params.id}"`
    });
  }
  return User
    .findAll({
      where: {
        id: req.params.id,
      },
      attributes: { exclude: ['password'] }
    })
    .then((user) => {
      if (!user.length) {
        res.status(404).json({ message: 'User not found' });
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(400).send({
      message: 'out of range'
    }));
}

/**
 *Update a user by Id
 * @param {object} req - updated user object
 * @param {object} res - updated user object or error
 * @returns {object} - return an object of the updated user
 */
function updateUser(req, res) {
  if (Number(req.decoded.id) !== Number(req.params.id)) {
    return res.status(401).json({
      message: 'You are not authorized to update this user'
    });
  }
  const userId = Number(req.params.id);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      User
      .findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return user
          .update({
            fullName: req.body.fullName || user.fullName,
            userName: req.body.userName || user.userName,
            email: req.body.email || user.email,
            password: hash || user.password,
            roleId: req.body.roleId || user.roleId
          })
          .then((updatedUser) => {
            res.status(200).send({
              id: updatedUser.id,
              fullName: updatedUser.fullName,
              userName: updatedUser.userName,
              email: updatedUser.email,
              roleId: updatedUser.roleId,
              message: 'Details successfully updated.'
            });
          })
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
    });
  });
}

/**
 * Delete a user by Id
 * @param {number} req - delete user with an id
 * @param {object} res - message
 * @returns {object} - null
 */
function deleteUser(req, res) {
  if (req.decoded.roleId !== 1) {
    return res.status(401).json({
      message: 'You are not authorized to access this field'
    });
  }
  return User
  .findById(req.params.id)
  .then((user) => {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return user
      .destroy()
      .then(() => res.status(204).json({
        message: 'User has been deleted successfully' }))
      .catch(error => res.status(400).send(error));
  })
  .catch(error => res.status(400).send(error));
}

/**
 * Get documents for specific user
 * @param {object} req - request object containing limit query and offset
 * @param {array} res - array of documents for the requested user
 * @return {array} - array of requested user's document
 */
function getUserDocuments(req, res) {
  const limit = req.query.limit;
  const offset = req.query.offset;
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      return Document.findAndCountAll({
        limit,
        offset,
        where: {
          userId: user.id
        }
      })
        .then(({ rows: document, count }) => {
          res.status(200).send({
            document,
            pagination: pagination(count, limit, offset),
          });
        })
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

export default {
  getUsers,
  createUser,
  login,
  findUser,
  updateUser,
  deleteUser,
  getUserDocuments
};
