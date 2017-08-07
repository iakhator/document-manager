import express from 'express';
import roleController from '../controllers/roles';
import auth from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Role:
 *     type: object
 *     required:
 *     - title
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       title:
 *         type: string
 *         example: admin
 *       createdAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29T09:12:33.001Z
 *       updatedAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29T09:12:33.001Z
 */

// Security schema definition
/**
 * @swagger
 * securityDefinitions:
 *   Authorization:
 *     type: apiKey
 *     description: JWT Token
 *     in: header
 *     name: Authorization
 */

router.route('/')

/**
 * @swagger
 * paths:
 *   /api/v1/roles:
 *     get:
 *       tags:
 *         - Role
 *       summary: Get all roles
 *       operationId: getRoles
 *       description:
 *         This route is only accessible to an admin to enable her get all roles.
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true
 *       responses:
 *         200:
 *           description: Roles found.
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Role'
 *       security:
 *       - Authorization: []
 *     post:
 *        tags:
 *          - Role
 *        summary: Create a new role
 *        description: Add a new role
 *        operationId: createRole
 *        consumes:
 *         - application/x-www-form-urlencoded
 *        produces:
 *          - application/json
 *        parameters:
 *          - in: header
 *            name: Authorization
 *            description: token from login
 *            required: true
 *          - in: formData
 *            name: title
 *            description: role to be added
 *            required: true
 *        responses:
 *          201:
 *            description: Role inserted
 *            schema:
 *              "$ref": '#/definitions/Role'
 *          400:
 *            description: Access Denied
 *        security:
 *        - Authorization: []
 */

  /** GET /api/roles - Get list of roles */
  .get(auth.verifyToken, auth.adminAccess, roleController.getRoles)

  /** POST /api/roles - Create roles */
  .post(auth.verifyToken, auth.adminAccess, roleController.createRole);

router.route('/:id')

/**
 * @swagger
 * paths:
 *   /api/v1/roles/{id}:
 *     get:
 *       tags:
 *         - Role
 *       summary: Get a role by id
 *       operationId: findRole
 *       description:
 *         This route is used to get a specific role.
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: The id of the role to be retrieved
 *         required: true
 *         type: integer
 *       responses:
 *         200:
 *           description: Role found.
 *           schema:
 *             type: object
 *             items:
 *               $ref: '#/definitions/Role'
 *         404:
 *           description: Role not found.
 *         400:
 *           description: Bad request.
 *         401:
 *           description: forbidden.
 *       security:
 *       - Authorization: []
 *     put:
 *       tags:
 *         - Role
 *       summary: Update Role information
 *       description: This can only be done by an admin.
 *       operationId: updateRole
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: id of the role that needs to be updated
 *         required: true
 *         type: integer
 *       - in: formData
 *         name: title
 *         description: New role title
 *         required: true
 *       responses:
 *         200:
 *           description: Role updated.
 *           schema:
 *             "$ref": "#/definitions/Role"
 *         400:
 *           description: Error.
 *         404:
 *           description: Not found.
 *       security:
 *       - Authorization: []
 *     delete:
 *       tags:
 *         - Role
 *       summary: Delete a Role
 *       description: This can only be done by an Admin.
 *       operationId: deleteRole
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: Id of the role that needs to be deleted
 *         required: true
 *         type: integer
 *       responses:
 *         400:
 *           description: Bad request.
 *         404:
 *           description: Role does not exist.
 *         204:
 *           description: Role deleted successfully.
 *       security:
 *       - Authorization: []
 */

  /** GET /api/users/roles - Find roles */
  .get(auth.verifyToken, auth.adminAccess, roleController.findRole)

  /** PUT /api/users/id - update roles */
  .put(auth.verifyToken, auth.adminAccess, roleController.updateRole)

  /** DELETE /api/users/id - delete roles */
  .delete(auth.verifyToken, auth.adminAccess, roleController.deleteRole);

export default router;
