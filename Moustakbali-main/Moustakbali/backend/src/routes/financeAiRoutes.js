import express from 'express';
import { financeAiChat } from '../controllers/financeAiController.js';

const router = express.Router();
router.post('/', financeAiChat);

export default router;
