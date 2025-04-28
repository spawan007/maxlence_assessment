import express from 'express';
const router = express.Router();
import USER from './user.js';

router.get('/', (req, res) => {
  return res.send({ status: true, message: "Route is working" });
});

router.use('/user', USER);

export default router;
