import { Router } from 'express';
import { jwt } from '../middleware/auth.js';
import content from '../middleware/content.js';
import admin from '../middleware/admin.js';

import { createReports } from '../controllers/reports.js';

const router = Router();

router.post('/', content('application/json'), jwt, createReports);

export default router;
