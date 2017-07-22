import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userController.get)

  /** POST /api/users - Create/Signup users */
  .post(userController.create);

router.route('/login')
  /** POST /api/users/login - Login users */
  .post(userController.login);

export default router;
