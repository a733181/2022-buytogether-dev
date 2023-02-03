import { Router } from 'express';
import content from '../middleware/content.js';
import admin from '../middleware/admin.js';
import upload from '../middleware/upload.js';
import { jwt } from '../middleware/auth.js';
import {
  createProduct,
  editProdcut,
  getAllMemberProducts,
  getSellProduct,
  getSellProducts,
  deletProduct,
  toggleLikeProduct,
  getSellMemberProduct,
  getFatoriteProduct,
} from '../controllers/products.js';

const router = Router();

router.post('/', content('multipart/form-data'), jwt, upload, createProduct);

router.get('/member', jwt, getAllMemberProducts);
router.get('/favorite', jwt, getFatoriteProduct);

router.get('/memberhome/:id', getSellMemberProduct);

router.patch('/likes', jwt, toggleLikeProduct);

router.get('/', getSellProducts);

router.get('/:id', getSellProduct);

router.delete('/:id', jwt, deletProduct);

router.patch('/:id', content('multipart/form-data'), jwt, upload, editProdcut);

export default router;
