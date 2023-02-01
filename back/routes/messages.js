import { Router } from 'express';
import { jwt } from '../middleware/auth.js';
import content from '../middleware/content.js';
import { createMessage } from '../controllers/messages.js';

const router = Router();

router.post('/', content('application/json'), jwt, createMessage);

export default router;
