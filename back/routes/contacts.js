import { Router } from 'express';
import { jwt } from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import content from '../middleware/content.js';

import {
  creatContact,
  getMemberContact,
  getAdminContact,
  replayContact,
} from '../controllers/contacts.js';

const router = Router();

router.get('/', jwt, getMemberContact);
router.post('/', content('application/json'), jwt, creatContact);
router.patch('/', content('application/json'), jwt, admin, replayContact);

router.get('/admin', jwt, admin, getAdminContact);
export default router;
