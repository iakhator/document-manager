import express from 'express';
import documentController from '../controllers/documents';
import auth from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Document:
 *     type: object
 *     required:
 *     - id
 *     - title
 *     - content
 *     - userId
 *     - access
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       title:
 *         type: string
 *         example:  Andela is fun
 *       content:
 *         type: string
 *         example: Lorem Ipsum
 *       userId:
 *         type: integer
 *         example: 1
 *       access:
 *         type: string
 *         enum:
 *           - "public"
 *           - "private"
 *           - "role"
 *         example: public
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
/**
 * Define document routes
 * @param {function} router
 * @returns {void}
 */

router.route('/')

/**
 * @swagger
 * paths:
 *   /api/v1/documents/:
 *     get:
 *       tags:
 *         - Documents
 *       summary: Get all documents
 *       description: ''
 *       operationId: getAllDocument
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
 *           description: Documents found.
 *           schema:
 *             "$ref": "#/definitions/Document"
 *         400:
 *           description: An error occurred.
 *       security:
 *       - Authorization: []
 *     post:
 *       tags:
 *         - Documents
 *       summary: Create a new document
 *       description: ''
 *       operationId: createDocument
 *       produces:
 *         - application/json
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - in: formData
 *         name: title
 *         description: document title
 *         required: true
 *       - in: formData
 *         name: content
 *         description: document content
 *         required: true
 *       - in: formData
 *         name: access
 *         description: Who can access the document
 *         required: true
 *       - in: formData
 *         name: userId
 *         description: UserId of the document's creator.
 *         required: true
 *       responses:
 *         200:
 *           description: Document created.
 *           schema:
 *             "$ref": '#/definitions/Document'
 *         400:
 *           description: Error. Please try again.
 *         403: Forbidden
 *       security:
 *       - Authorization: []
 */

  /** GET /api/v1/documents - Get all documents */
  .get(auth.verifyToken, documentController.getAllDocument)

  /** POST /api/v1/documents - Create document */
  .post(auth.verifyToken, documentController.createDocument);

router.route('/:id')

/**
 * @swagger
 * paths:
 *   /api/v1/documents/{id}:
 *     get:
 *       tags:
 *         - Documents
 *       summary: Get a document by its id
 *       description: ''
 *       operationId: findDocument
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true
 *         - name: id
 *           in: path
 *           description: The id of the document the user wants.
 *           required: true
 *           type: integer
 *       responses:
 *         200:
 *           description: 'Document found'
 *           schema:
 *             "$ref": "#/definitions/Document"
 *         400:
 *           description: Error.
 *         403:
 *           description: You do not have permission to access this document.
 *         404:
 *           description: Document not found.
 *       security:
 *       - Authorization: []
 *     put:
 *       tags:
 *         - Documents
 *       summary: Update a document
 *       description: This can only be done by the author
 *       operationId: updateDocument
 *       produces:
 *         - application/json
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true
 *         - name: id
 *           in: path
 *           description: id of the document that needs to be updated.
 *           required: true
 *           type: integer
 *         - in: formData
 *           name: title
 *           description: new title
 *           required: false
 *         - in: formData
 *           name: content
 *           description: new content
 *           required: false
 *         - in: formData
 *           name: access
 *           description: new access type
 *           required: false
 *       responses:
 *         200:
 *           description: 'document created'
 *           schema:
 *             "$ref": "#/definitions/Document"
 *         400:
 *           description: Invalid document id supplied.
 *         401:
 *           description: You don't have that privilege.
 *         404:
 *           description: Cannot find document.
 *       security:
 *       - Authorization: []
 *     delete:
 *       tags:
 *         - Documents
 *       summary: Delete a document
 *       description: This can only be done by the author
 *       operationId: deleteDocument
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true
 *         - name: id
 *           in: path
 *           description: The id of the document that needs to be deleted.
 *           required: true
 *           type: integer
 *       responses:
 *         204:
 *           description: ''
 *         401:
 *           description: You don't have that privilege.
 *         400:
 *           description: Error.
 *         404:
 *           description: Document does not exist.
 *       security:
 *       - Authorization: []
 */

  /** PUT /api/v1/documents/id - Create document */
  .put(auth.verifyToken, documentController.updateDocument)

  /** GET /api/v1/documents/id - get document */
  .get(auth.verifyToken, documentController.findDocument)

  /** DELETE /api/v1/documents/id - delete document */
  .delete(auth.verifyToken, documentController.deleteDocument);

export default router;
