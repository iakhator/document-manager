import express from 'express';
import roleController from '../controllers/roles';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/')
  /** GET /api/roles - Get list of roles */
  .get(auth.verifyToken, auth.adminAccess, roleController.getRoles)

  /** POST /api/roles - Create roles */
  .post(auth.verifyToken, auth.adminAccess, roleController.createRole);

// router.route('/:id')
//   /** GET /api/users/roles - Find roles */
//   .get(auth.verifyToken, roleController.findRole)
//
//   /** PUT /api/users/id - update roles */
//   .put(auth.verifyToken, roleController.updateRole)
//
//   /** DELETE /api/users/id - delete roles */
//   .delete(auth.verifyToken, roleController.deleteRole);
export default router;
