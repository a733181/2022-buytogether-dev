import { Router } from 'express';
import { jwt } from '../middleware/auth.js';
import content from '../middleware/content.js';

import { creatContact, getMemberContact } from '../controllers/contacts.js';

const router = Router();

router.get('/', jwt, getMemberContact);
router.post('/', content('application/json'), jwt, creatContact);

export default router;
