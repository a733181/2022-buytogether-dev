import { Router } from 'express';
import content from '../middleware/content.js';
import * as auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

import {
  register,
  login,
  logout,
  extend,
  getUser,
  editUser,
  toggleFatorite,
  toggleList,
  getTrackList,
  getBlackList,
  editCart,
  getCart,
  deleteCart,
} from '../controllers/users.js';

import { createBank, getAllBanks, deleteBank, editBank } from '../controllers/banks.js';

import {
  createAddress,
  getAllAddress,
  editAddress,
  deleteAddress,
} from '../controllers/address.js';

const router = Router();

router.post('/', content('application/json'), register);
router.post('/login', content('application/json'), auth.login, login);
router.delete('/logout', auth.jwt, logout);
router.patch('/extend', auth.jwt, extend);
router.get('/me', auth.jwt, getUser);
router.patch('/edit', content('multipart/form-data'), auth.jwt, upload, editUser);

router.get('/bank', auth.jwt, getAllBanks);
router.post('/bank', content('application/json'), auth.jwt, createBank);
router.patch('/bank/:id', content('application/json'), auth.jwt, editBank);
router.delete('/bank/:id', auth.jwt, deleteBank);

router.get('/address', auth.jwt, getAllAddress);
router.post('/address', content('application/json'), auth.jwt, createAddress);
router.patch('/address/:id', content('application/json'), auth.jwt, editAddress);
router.delete('/address/:id', auth.jwt, deleteAddress);

router.post('/favorite', auth.jwt, toggleFatorite);
router.post('/list', auth.jwt, toggleList);

router.get('/track', auth.jwt, getTrackList);
router.get('/black', auth.jwt, getBlackList);

router.post('/cart', content('application/json'), auth.jwt, editCart);
router.get('/cart', auth.jwt, getCart);
router.delete('/cart/:id', auth.jwt, deleteCart);

export default router;
