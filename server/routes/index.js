import express from 'express';
import userRoutes from './users';
import searchRoutes from './search';
import documentRoutes from './documents';


const router = express.Router();

/** GET /api-status - Check service status **/
router.use('/users', userRoutes);
router.use('/search', searchRoutes);
router.use('/documents', documentRoutes);

export default router;
