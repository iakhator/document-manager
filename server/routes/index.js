import express from 'express';
import userRoutes from './users';
import searchRoutes from './search';


const router = express.Router();

/** GET /api-status - Check service status **/
router.use('/users', userRoutes);
router.use('/search', searchRoutes);

export default router;
