const express = require('express');
const { create, listAdmin, updateStatus } = require('../controllers/orderController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', create);
router.get('/admin/all', requireAdmin, listAdmin);
router.patch('/:id/statut', requireAdmin, updateStatus);

module.exports = router;
