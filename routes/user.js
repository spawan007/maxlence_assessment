import express from 'express';
const router = express.Router();
import { register, login, verifyEmail, resendVerificationEmail, requestPasswordReset, resetPassword } from '../controller/authController.js';
import { upload } from '../middleware/multer.js';

router.get('/', (req, res) => {
    return res.send({ status: true, message: "User route is working" })
});

router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
