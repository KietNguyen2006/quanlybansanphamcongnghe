const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {
  getOrderStats,
  getTopProducts,
  getDailyStats,
  getAllOrders
} = require('../controllers/statsController');

const router = express.Router();

// Tất cả các định tuyến thống kê đều yêu cầu quyền admin
router.use(authenticate);
router.use(authorizeAdmin);

router.get('/orders', getOrderStats);
router.get('/top-products', getTopProducts);
router.get('/daily', getDailyStats);
router.get('/all-orders', getAllOrders);

module.exports = router;
