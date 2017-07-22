import bcrypt from 'bcrypt';

import pagination from '../helpers/helper';
import models from '../models';

const User = models.User;

function get(req, res) {
  return res.json({ ok: 'none' });
}

function create(req, res) {
  req.check('fullName', 'FullName is required').notEmpty();
  req.check('userName', 'userName is required').notEmpty();
  req.check('email', 'FullName is required').notEmpty();
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
  res.send('login page');
}

export default { get, create, login };
