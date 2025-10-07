const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {
  createOrder,
  getUserOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

// Định tuyến công khai cho phép khách hoặc người dùng tạo đơn hàng
router.post('/', createOrder);

// Định tuyến yêu cầu đăng nhập để người dùng xem lịch sử đơn hàng của họ
router.get('/my-orders', authenticate, getUserOrders);

// Định tuyến chỉ dành cho quản trị viên để cập nhật trạng thái đơn hàng
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

module.exports = router;
