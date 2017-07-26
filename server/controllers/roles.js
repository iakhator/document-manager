const models = require('../models');

const Role = models.Role;

/**
 * Creates a new Role.
 * @param {object} req - role to be created
 * @param {object} res - new created role
 * @returns {object} - newly created role
 */
function createRole(req, res) {
  req.check('title', 'Title is required').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json({ errors });
  } else {
    Role.findAll({
      where: { title: req.body.title }
    }).then((err, existingRole) => {
      if (!existingRole) {
        Role.create({
          title: req.body.title
        }).then((role) => {
          res.status(201).send({
            message: 'Role successfully created',
            role
          });
        }).catch((error) => {
          res.json(error.errors);
        });
      }
    }).catch(error => res.json(error));
  }
}

/**
 * Get all roles.
 * @param {void} req - no request body attached
 * @param {array} res - an array of roles and their id
 * @returns {array} array of roles
 */
function getRoles(req, res) {
  return Role
    .findAll()
    .then(role => res.status(200).json(role))
    .catch(error => res.json(error));
}

export default { createRole, getRoles };
