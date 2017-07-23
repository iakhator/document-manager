import express from 'express';
import documentController from '../controllers/documents';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/')
  /** GET /api/v1/documents - Get all documents */
  // .get(documentController.getDocuments)

  /** POST /api/v1/documents - Create document */
  .post(auth.verifyToken, documentController.createDocument);
export default router;
