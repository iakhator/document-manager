import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import helper from '../helpers/helper';
import models from '../models';

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const User = models.User;
const metaData = helper.paginationMetaData;



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
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        User.findAll({
          where: { email: req.body.email }
        }).then((err, user) => {
          if (!user) {
            User.create({
              fullName: req.body.fullName,
              userName: req.body.userName,
              email: req.body.email,
              password: hash,
              roleId: req.body.roleId || 2
            }).then((userDetails) => {
              res.status(200).json({
                userDetails,
                success: 'ok',
                message: 'You have successfully registered.'
              });
            }).catch((error) => {
              res.status(400).json(error);
            });
          }
        });
      });
    });
  }
}

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
        bcrypt
        .compare(req.body.password, existingUser.password, (err, result) => {
          if (err) throw err;
          if (result) {
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
        });
      }
    }).catch(error => res.status(400).send(error));
  }
}


export default { , createUser, login, };
