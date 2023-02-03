import { Router } from 'express';

import { jwt } from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import content from '../middleware/content.js';

import {
  createOrder,
  getMyBuyOrders,
  paidOrders,
  shipOrders,
  getMySellOrders,
} from '../controllers/orders.js';

const router = Router();

router.post('/', content('application/json'), jwt, createOrder);

router.get('/buy', jwt, getMyBuyOrders);

router.get('/sell', jwt, getMySellOrders);

router.patch('/paid/:id', content('application/json'), jwt, paidOrders);

router.patch('/ship/:id', content('application/json'), jwt, shipOrders);

// router.get('/all', jwt, getAllOrders);

export default router;
