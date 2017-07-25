import express from 'express';
import searchController from '../controllers/search';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/users')
  /** GET /api/v1/users - search list of users */
  .get(auth.verifyToken, auth.adminAccess, searchController.searchUser);

router.route('/documents')
  /** GET /api/v1/search - search list of documents */
  .get(auth.verifyToken, searchController.searchDocuments);

export default router;
