import express from 'express';
import searchController from '../controllers/search';
import auth from '../middlewares/auth';

const router = express.Router();

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

router.route('/users')

/**
 * @swagger
 * paths:
 *   /api/v1/search/users/:
 *     get:
 *       tags:
 *         - User
 *       summary: Search user by userName
 *       description: Find a user by the user's name
 *       operationId: getAllUsers
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: q
 *         in: query
 *         description: The name of the user that needs to be fetched.
 *         required: true
 *         type: string
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 users: [
 *                    {
 *                      id: 3,
 *                      userName: "baas",
 *                      fullName: "Baas Bank",
 *                      email: "baas@test.com",
 *                      roleId: "1"
 *                    }
 *                  ],
 *                  pagination: {
 *                    totalCount: 1,
 *                    currentPage: 1,
 *                    pageCount: 1,
 *                    pageSize: 1
 *                 }
 *                }
 *           schema:
 *             $ref: '#/definitions/User'
 *         400:
 *           description: Bad Request.
 *         404:
 *           description: Not Found.
 *           examples:
 *             application/json:
 *               {
 *                 message: "Search term does not match any user."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *       security:
 *       - Authorization: []
 */

  /** GET /api/v1/users - search list of users */
  .get(auth.verifyToken, auth.adminAccess, searchController.searchUser);

router.route('/documents')

/**
 * @swagger
 * paths:
 *   /api/v1/search/documents:
 *      get:
 *        tags:
 *          - Documents
 *        summary: Search for a document by title
 *        description: ''
 *        operationId: searchDocuments
 *        produces:
 *          - application/json
 *        parameters:
 *          - in: header
 *            name: Authorization
 *            description: token from login
 *            required: true
 *          - name: q
 *            in: query
 *            description: title of document(s) to search
 *            required: true
 *            type: string
 *        responses:
 *          200:
 *            description: OK
 *            examples:
 *              application/json:
 *                {
 *                   users: [
 *                     {
 *                        id: 1,
 *                        title: "Successful",
 *                        content: "Everyday in everyway, through the grace of God, I am",
 *                        access: "public",
 *                        userId: 5
 *                       }
 *                    ],
 *                   pagination: {
 *                     totalCount: 1,
 *                     currentPage: 1,
 *                     pageCount: 1,
 *                     pageSize: 1
 *                  }
 *               }
 *            schema:
 *              $ref: '#/definitions/Document'
 *          404:
 *            description: Not Found
 *            examples:
 *              application/json:
 *                {
 *                  message: "Search term does not match any document."
 *                }
 *            schema:
 *             $ref: "#/definitions/Document"
 *        security:
 *        - Authorization: []
 */

  /** GET /api/v1/search - search list of documents */
  .get(auth.verifyToken, searchController.searchDocuments);

export default router;
