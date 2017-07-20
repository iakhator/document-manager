import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userController.get)

  /** POST /api/users - Get list of users */
  .post(userController.create);


export default router;
