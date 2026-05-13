import express from 'express';
import { transcribe } from '../controllers/transcribeController.js';

const router = express.Router();
router.post('/', transcribe);

export default router;
