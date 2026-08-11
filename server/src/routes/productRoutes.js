const express = require('express');
const { listPublic, getOne, listAdmin, create, update, remove, moveToTop } = require('../controllers/productController');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../services/cloudinary');

const router = express.Router();

router.get('/', listPublic);
router.get('/admin/all', requireAdmin, listAdmin);
router.get('/:id', getOne);
router.post('/', requireAdmin, upload.array('images', 5), create);
router.put('/:id', requireAdmin, upload.array('images', 5), update);
router.patch('/:id/move-to-top', requireAdmin, moveToTop);
router.delete('/:id', requireAdmin, remove);

module.exports = router;
