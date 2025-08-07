const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

// Lấy tất cả thương hiệu
router.get('/', brandController.getAllBrands);
// Lấy thông tin một thương hiệu
router.get('/:id', brandController.getBrandById);
// Thêm thương hiệu (Admin)
router.post('/', authenticate, authorizeAdmin, brandController.createBrand);
// Sửa thương hiệu (Admin)
router.put('/:id', authenticate, authorizeAdmin, brandController.updateBrand);
// Xóa thương hiệu (Admin)
router.delete('/:id', authenticate, authorizeAdmin, brandController.deleteBrand);

module.exports = router;
