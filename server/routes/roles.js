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
 *         example: 2016-08-29
 *       updatedAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29
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
 *            description: OK
 *            examples:
 *              application/json:
 *                {
 *                  roles: [
 *                    {
 *                      id: 1,
 *                      title: "admin",
 *                      createdAt: "2017-07-26",
 *                      updatedAt: "2017-07-26"
 *                    },
 *                    {
 *                      id: 2,
 *                      title: "fellow",
 *                      createdAt: "2017-07-26",
 *                      updatedAt: "2017-07-26"
 *                    }
 *                  ]
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
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
 *            description: Created
 *            examples:
 *              application/json:
 *                {
 *                  message: "Role created successfully."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
 *          400:
 *            description: Bad Request
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
 *            description: OK
 *            examples:
 *              application/json:
 *                {
 *                   id: 1,
 *                   title: "admin",
 *                   createdAt: "2017-07-26",
 *                   updatedAt: "2017-07-26"
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
 *         404:
 *            description: Not Found
 *            examples:
 *              application/json:
 *                {
 *                  message: "Role not found."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
 *         400:
 *           description: Bad request.
 *         403:
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
 *            description: OK
 *            examples:
 *              application/json:
 *                {
 *                  message: "Role updated successfully."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
 *         400:
 *           description: Bad Request.
 *         404:
 *            description: Not Found
 *            examples:
 *              application/json:
 *                {
 *                  message: "Role not found."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
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
 *            description: Created
 *            examples:
 *              application/json:
 *                {
 *                  message: "Role does not exist."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
 *         200:
 *            description: No Content
 *            examples:
 *              application/json:
 *                {
 *                  message: "Role deleted successfully."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
 *         401:
 *            description: Unauthorized
 *            examples:
 *              application/json:
 *                {
 *                  message: "You are not authorized."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
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
