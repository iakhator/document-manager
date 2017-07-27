import express from 'express';
import searchController from '../controllers/search';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/users')
  /** GET /api/users - Get list of users */
  .get(auth.verifyToken, auth.adminAccess, searchController.searchUser);

router.route('/documents')
  /** GET /api/documents - Get list of users */
  .get(auth.verifyToken, auth.adminAccess, searchController.searchDocuments);

export default router;
