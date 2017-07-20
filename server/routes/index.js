import express from 'express';
import userRoutes from './users';


const router = express.Router();

/** GET /api-status - Check service status **/
router.use('/users', userRoutes);

export default router;
