import express from 'express';
import documentController from '../controllers/documents';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/')
  /** GET /api/v1/documents - Get all documents */
  .get(auth.verifyToken, documentController.getAllDocument)

  /** POST /api/v1/documents - Create document */
  .post(auth.verifyToken, documentController.createDocument);

router.route('/:id')
  /** PUT /api/v1/documents/id - Create document */
  .put(auth.verifyToken, documentController.updateDocument)

  /** GET /api/v1/documents/id - find document */
  .get(auth.verifyToken, documentController.findDocument)

  /** GET /api/v1/documents/id - find document */
  .delete(auth.verifyToken, documentController.deleteDocument);

export default router;
