const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/productController');

const router = express.Router();

// Các định tuyến công khai
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);

// Các định tuyến chỉ dành cho Admin
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
