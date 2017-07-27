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

/**
 * Find roles by Id.
 * @param {number} req - requested role
 * @param {object} res - role found by id
 * @returns {object} - role found by id
 */
function findRole(req, res) {
  return Role
    .findById(req.params.id)
    .then((role) => {
      if (!role) {
        return res.status(404).json({
          message: 'Role not found'
        });
      }
      res.status(200).json(role);
    }).catch(error => res.status(400).json(error));
}

/**
 * Update role.
 * @param {number} req - requested role by id
 * @param {object} res - updated role
 * @returns {object} - updated role status
 */
function updateRole(req, res) {
  if (req.decoded.roleId !== 1) {
    return res.status(401)
      .json({ message: 'You are not authorized to access the role' });
  }
  return Role
    .findById(req.params.id)
    .then((role) => {
      if (!role) {
        return res.status(404).json({
          message: 'Role not found'
        });
      }
      return role
        .update({
          title: req.body.title || role.title
        })
        .then(() => res.status(200).json({
          message: 'Role updated successfully',
          role
        }))
        .catch(error => res.status(400).json(error));
    }).catch(error => res.status(400).json(error));
}

/**
 * Delete roles by Id.
 * @param {number} req - role to be deleted by id
 * @param {object} res - deleted role
 * @returns {object} - message
 */
function deleteRole(req, res) {
  if (req.decoded.roleId !== 1) {
    return res.status(401)
      .json({ message: 'You are not authorized to access the role' });
  }
  return Role.findById(req.params.id)
    .then((role) => {
      if (!role) {
        res.status(404).json({
          message: 'Role not found'
        });
      }
      return role
        .destroy()
        .then(() => res.status(204)
          .send({
            message: 'Role deleted successfully'
          }))
          .catch(error => res.status(400).send(error));
    }).catch(error => res.json(error));
}

export default { createRole, getRoles, findRole, updateRole, deleteRole };
