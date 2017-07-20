import express from 'express';

const router = express.Router();

/** GET /api-status - Check service status **/
router.get('/api-status', (req, res) =>
  res.json({
    status: 'ok'
  })
);

export default router;
