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

router.route('/:id')
  /** GET /api/users/id - Find users */
  .get(auth.verifyToken, userController.findUser)

  /** PUT /api/users/id - update users */
  .put(auth.verifyToken, userController.updateUser)

  /** DELETE /api/users/id - delete users */
  .delete(auth.verifyToken, userController.deleteUser);

router.route('/:id/documents')
<<<<<<< HEAD
  /** GET /api/users/id/documents - get user document */
=======
  /** GET /api/users/id/documents - Find documents of a specific user*/
>>>>>>> 4f5d186dbe87514d3eeabae2b55811aef05eb4c6
  .get(auth.verifyToken, userController.getUserDocuments);

export default router;
