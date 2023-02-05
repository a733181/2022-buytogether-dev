import { Router } from 'express';

import { jwt } from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import content from '../middleware/content.js';

import {
  createOrder,
  getMyBuyOrders,
  editOrder,
  getMySellOrders,
  getAdminOrders,
} from '../controllers/orders.js';

const router = Router();

router.post('/', content('application/json'), jwt, createOrder);

router.get('/buy', jwt, getMyBuyOrders);

router.get('/sell', jwt, getMySellOrders);

router.patch('/:id', content('application/json'), jwt, editOrder);

router.get('/all', jwt, admin, getAdminOrders);

export default router;
