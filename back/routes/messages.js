import { Router } from 'express';
import { jwt } from '../middleware/auth.js';
import content from '../middleware/content.js';
import {
  createMessage,
  getProductMessage,
  getMemberAllProductMessage,
  getMemberProductMessage,
  replayMessage,
} from '../controllers/messages.js';

const router = Router();

router.post('/', content('application/json'), jwt, createMessage);
router.get('/', jwt, getMemberAllProductMessage);
router.get('/:id', getProductMessage);
router.patch('/:id', content('application/json'), jwt, replayMessage);

router.get('/member/:id', jwt, getMemberProductMessage);

export default router;
