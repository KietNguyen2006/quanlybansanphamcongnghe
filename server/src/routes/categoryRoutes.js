const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

// Lấy tất cả danh mục
router.get('/', categoryController.getAllCategories);
// Thêm danh mục (Admin)
router.post('/', authenticate, authorizeAdmin, categoryController.createCategory);
// Sửa danh mục (Admin)
router.put('/:id', authenticate, authorizeAdmin, categoryController.updateCategory);
// Xóa danh mục (Admin)
router.delete('/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

module.exports = router;
