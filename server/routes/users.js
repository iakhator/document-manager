import express from 'express';
import userController from '../controllers/users';
import auth from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *     - userName
 *     - fullName
 *     - email
 *     - password
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       userName:
 *         type: string
 *         example: baas
 *       fullName:
 *         type: string
 *         example: Baasbank Dutch
 *       email:
 *         type: string
 *         example: baasbank@cold.com
 *       password:
 *         type: string
 *         example: password
 *       roleId:
 *         type: integer
 *         example: 1
 *       createdAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29
 *       updatedAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29
 *   Document:
 *     type: object
 *     required:
 *     - title
 *     - content
 *     - access
 *     - userId
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       title:
 *         type: string
 *         example:  I'm a banana
 *       content:
 *         type: string
 *         example: Lorem Ipsum
 *       access:
 *         type: string
 *         example: public
 *       userId:
 *         type: integer
 *         example: 2
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
router.route('/login')
   /** POST /api/users/login - Login users */

   /**
  * @swagger
  * paths:
  *   /api/v1/users/login:
  *     post:
  *       tags:
  *         - User
  *       summary: Login a user
  *       operationId: login
  *       description: Logs in a user and provides them with a jwt token
  *       consumes:
  *         - application/x-www-form-urlencoded
  *       produces:
  *         - application/json
  *       parameters:
  *       - name: email
  *         in: formData
  *         description: The user's email address
  *         required: true
  *         type: string
  *       - name: password
  *         in: formData
  *         description: The password for login in clear text
  *         required: true
  *         type: string
  *       responses:
  *         200:
  *           description: OK.
  *           examples:
  *             application/json:
  *               {
  *                 success: "true",
  *                 token: "ewukjlvnfeoielfkmn94jdnkfkdjfkdkpojfkjfklsdkkdjksdklsdkfldfj"
  *               }
  *           schema:
  *             $ref: '#/definitions/User'
  *           headers:
  *             Authorization:
  *               type: string
  *               format: int32
  *               description: stores user jwt token
  *         400:
  *           description: Bad request.
  *           examples:
  *             application/json:
  *               {
  *                 success: "true",
  *                 message: "Authentication failed. User not found."
  *               }
  *         401:
  *           description: Unauthorized.
  *           examples:
  *             application/json:
  *               {
  *                 success: "true",
  *                 message: "Authentication failed. Wrong password."
  *               }
  */
   .post(userController.login);

router.route('/')
  /** GET /api/users - Get list of users */

/**
 * @swagger
 * paths:
 *   /api/v1/users:
 *     post:
 *       tags:
 *         - User
 *       summary: Create a new user
 *       operationId: createNewUser
 *       description: Adds a new user to the Users collection
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: formData
 *           name: userName
 *           description: User's username/nickname
 *           required: true
 *         - in: formData
 *           name: fullName
 *           description: User's full name
 *           required: true
 *         - in: formData
 *           name: email
 *           description: User's email address
 *           required: true
 *         - in: formData
 *           name: password
 *           description: User's password
 *           required: true
 *       responses:
 *         201:
 *           description: Created.
 *           examples:
 *             application/json:
 *               message: "signup successful"
 *               user: {
 *                 id: 5,
 *                 userName: "framky",
 *                 fullName: "Frank Ajaps",
 *                 email: "ajaps@test.com",
 *                 roleId: 2
 *                }
 *           schema:
 *             $ref: "#/definitions/User"
 *         400:
 *           description: Bad request.
 *           examples:
 *             application/json:
 *               {
 *                "errors": [
 *                  {
 *                    "param": "userName",
 *                    "msg": "userName is required"
 *                  },
 *                  {
 *                    "param": "password",
 *                    "msg": "Password is required"
 *                  }
 *                ]
 *               }
 *           schema:
 *             $ref: "#/definitions/User"
 *     get:
 *       tags:
 *         - User
 *       summary: Get all users
 *       operationId: getUsers
 *       description:
 *         This route is only accessible to an admin.
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true
 *         - in: query
 *           name: limit
 *           description: Pagination limit
 *           required: false
 *         - in: query
 *           name: offset
 *           description: Pagination offset
 *           required: false
 *       responses:
 *         200:
 *           examples:
 *             application/json:
 *               {
 *                 users: [
 *                   {
 *                    id: 3,
 *                    userName: "esty",
 *                    fullName: "Esther Falayi",
 *                    email: "fals@test.com",
 *                    roleId: 2,
 *                    "createdAt": "2017-08-14",
 *                    "updatedAt": "2017-08-14"
 *                   },
 *                   {
 *                    id: 2,
 *                    userName: "beng",
 *                    fullName: "Ben George",
 *                    email: "beng@test.com",
 *                    roleId: 1,
 *                    "createdAt": "2017-08-14",
 *                    "updatedAt": "2017-08-14"
 *                   },
 *                   {
 *                    id: 2,
 *                    userName: ayomat,
 *                    fullName: "Ayodele Mattew",
 *                    email: "fals@test.com",
 *                    roleId: 3,
 *                    "createdAt": "2017-08-14",
 *                    "updatedAt": "2017-08-14"
 *                   },
 *                  ]
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         400:
 *           description: Bad request.
 *       security:
 *       - Authorization: []
 */
  .get(auth.verifyToken, auth.adminAccess, userController.getUsers)

  /** POST /api/users - Create/Signup users */
  .post(userController.createUser);

router.route('/:id')

/**
 * @swagger
 * paths:
 *   /api/v1/users/{id}:
 *     get:
 *       tags:
 *         - User
 *       summary: Get a user by id
 *       operationId: findUser
 *       description:
 *         This route is used to get a specific user.
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: The id of the user to be retrieved
 *         required: true
 *         type: integer
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 id: 3,
 *                 userName: adewill,
 *                 fullName: "Ade Williams",
 *                 email: "ade@test.com",
 *                 roleId: 2
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         404:
 *           description: Not Found.
 *           examples:
 *             application/json:
 *               {
 *                 message: "User not found."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         400:
 *           description: Bad request.
 *         403:
 *           description: forbidden.
 *           examples:
 *             application/json:
 *               {
 *                 message: "Unauthorized access."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *       security:
 *       - Authorization: []
 *     put:
 *       tags:
 *         - User
 *       summary: Update user information
 *       description: This can only be done by the logged in user.
 *       operationId: updateUser
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
 *         description: id of the user that needs to be updated
 *         required: true
 *         type: integer
 *       - in: formData
 *         name: userName
 *         description: New userName
 *         required: false
 *       - in: formData
 *         name: fullName
 *         description: New fullName
 *         required: false
 *       - in: formData
 *         name: email
 *         description: New email address
 *         required: false
 *       - in: formData
 *         name: password
 *         description: New password
 *         required: false
 *       - in: formData
 *         name: roleId
 *         description: New role type (only for admin)
 *         required: false
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 user: {
 *                    id: 4,
 *                    userName: bassbank,
 *                    fullName: Baas Awesome Bank,
 *                    email: baas@test.com,
 *                    roleId: 2,
 *                    message: 'Details successfully updated.'
 *                  }
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         400:
 *           description: Error.
 *         401:
 *           description: Unauthorized.
 *         404:
 *           description: Not Found.
 *           examples:
 *             application/json:
 *               {
 *                 message: "User not found."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *       security:
 *       - Authorization: []
 *     delete:
 *       tags:
 *         - User
 *       summary: Delete a user
 *       description: This can only be done by the logged in user.
 *       operationId: deleteUser
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: Id of the user that needs to be deleted
 *         required: true
 *         type: integer
 *       responses:
 *         401:
 *           description: Unauthorized
 *           examples:
 *             application/json:
 *               {
 *                 message: "You are not authorized to access this field."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         400:
 *           description: Bad request.
 *         404:
 *           description: Not Found
 *           examples:
 *             application/json:
 *               {
 *                 message: "User not found."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         204:
 *           description: No Content.
 *           examples:
 *             application/json:
 *               {
 *                 message: "User has been deleted successfully."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *       security:
 *       - Authorization: []
 */

  /** GET /api/users/id - Find users */
  .get(auth.verifyToken, userController.findUser)

  /** PUT /api/users/id - update users */
  .put(auth.verifyToken, userController.updateUser)

  /** DELETE /api/users/id - delete users */
  .delete(auth.verifyToken, userController.deleteUser);

router.route('/:id/documents')

/**
 * @swagger
 * paths:
 *   /api/v1/users/{id}/documents :
 *     get:
 *       tags:
 *         - User
 *       summary: Get all documents belonging to a user
 *       operationId: getAUser
 *       description: |
 *         This route is used to get a specific user.
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: The id of the user whose documents is to be retrieved
 *         required: true
 *         type: integer
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 documents: [
 *                  {
 *                    id: 1,
 *                    title: My first document,
 *                    content: lorem ipsum and the rest of it,
 *                    access: public,
 *                    userId: 1
 *                  }
 *                ],
 *                  pagination: {
 *                    totalCount: 1,
 *                    currentPage: 1,
 *                    pageCount: 1,
 *                    pageSize: 1
 *                }
 *             }
 *           schema:
 *             $ref: '#/definitions/Document'
 *         400:
 *           description: Bad request.
 *       security:
 *       - Authorization: []
 */

  /** GET /api/users/id/documents - Find documents of a specific user*/
  .get(auth.verifyToken, userController.getUserDocuments);

export default router;
