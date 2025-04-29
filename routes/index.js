import express from 'express';
const router = express.Router();
import USER from './user.js';
import Admin from './adminRoutes.js'

router.get('/', (req, res) => {
  return res.send({ status: true, message: "Route is working" });
});

router.use('/user', USER);
router.use('/admin', Admin);

export default router;
