import express from 'express';
import searchController from '../controllers/search';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/users')
  /** GET /api/v1/users - search list of users */
  .get(auth.verifyToken, auth.adminAccess, searchController.searchUser);

router.route('/documents')
<<<<<<< HEAD
  /** GET /api/documents - Get list of users */
  .get(auth.verifyToken, auth.adminAccess, searchController.searchDocuments);
=======
  /** GET /api/v1/search - search list of documents */
  .get(auth.verifyToken, searchController.searchDocuments);
>>>>>>> 4f5d186dbe87514d3eeabae2b55811aef05eb4c6

export default router;
