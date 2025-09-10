import express from 'express';
import { sendEmail, sendGroupEmails } from '../controllers/emailController.js';
import { verifyAccessToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-email', verifyAccessToken,sendEmail);
router.post('/send-group-emails', verifyAccessToken, sendGroupEmails);

export default router;