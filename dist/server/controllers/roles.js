'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var models = require('../models');

var Role = models.Role;

/**
 * Creates a new Role.
 * @param {object} req - role to be created
 * @param {object} res - new created role
 * @returns {object} - newly created role
 */
function createRole(req, res) {
  req.check('title', 'Title is required').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json({ errors: errors });
  } else {
    Role.findAll({
      where: { title: req.body.title }
    }).then(function (err, existingRole) {
      if (!existingRole) {
        Role.create({
          title: req.body.title
        }).then(function (role) {
          res.status(201).send({
            message: 'Role successfully created',
            role: role
          });
        }).catch(function (error) {
          res.json(error.errors);
        });
      }
    }).catch(function (error) {
      return res.json(error);
    });
  }
}

/**
 * Get all roles.
 * @param {void} req - no request body attached
 * @param {array} res - an array of roles and their id
 * @returns {array} array of roles
 */
function getRoles(req, res) {
  return Role.findAll().then(function (role) {
    return res.status(200).json(role);
  }).catch(function (error) {
    return res.json(error);
  });
}

exports.default = { createRole: createRole, getRoles: getRoles };