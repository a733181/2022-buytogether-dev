import { Router } from 'express';
import content from '../middleware/content.js';
import admin from '../middleware/admin.js';
import * as auth from '../middleware/auth.js';

const router = Router();

export default router;
