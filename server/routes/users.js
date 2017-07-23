import express from 'express';
import userController from '../controllers/users';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/')
  /** GET /api/users - Get list of users */
  .get(auth.verifyToken, auth.adminAccess, userController.getUsers)

  /** POST /api/users - Create/Signup users */
  .post(userController.createUser);

router.route('/login')
  /** POST /api/users/login - Login users */
  .post(userController.login);


export default router;
