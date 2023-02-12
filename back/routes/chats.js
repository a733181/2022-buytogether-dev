import { Router } from 'express';
import { jwt } from '../middleware/auth.js';
import content from '../middleware/content.js';
import { createChat, getAllChat, getAllUser } from '../controllers/chats.js';

const router = Router();

router.post('/', content('application/json'), jwt, createChat);
router.post('/all', content('application/json'), jwt, getAllChat);
router.post('/users', content('application/json'), jwt, getAllUser);

export default router;
