import express from 'express';
import searchController from '../controllers/documents';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/users')
  /** GET /api/users - Get list of users */
  .get(auth.verifyToken, auth.adminAccess, searchController.searchUser);

  /** POST /api/users - Create/Signup users */

export default router;
