const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  getOrderStats,
  getTopProducts,
  getDailyStats,
  getAllOrders
} = require('../controllers/statsController');

const router = express.Router();

// Tất cả routes đều cần quyền admin
router.use(protect);
router.use(authorize('admin'));

router.get('/orders', getOrderStats);
router.get('/top-products', getTopProducts);
router.get('/daily', getDailyStats);
router.get('/all-orders', getAllOrders);

module.exports = router; 