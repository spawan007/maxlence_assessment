import express from 'express';
const router = express.Router();
import { register, login } from '../controller/authController.js';

router.get('/', (req, res) => {
    return res.send({ status: true, message: "User route is working" })
});

router.post('/register', register);
router.post('/login', login);

export default router;
