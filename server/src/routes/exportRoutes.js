const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {
  exportOrderStats,
  exportProductReport,
  exportInvoice
} = require('../controllers/excelController');

const router = express.Router();

// Tất cả các định tuyến xuất dữ liệu đều yêu cầu đăng nhập và quyền admin
router.use(authenticate);
router.use(authorizeAdmin);

router.get('/orders', exportOrderStats);
router.get('/products', exportProductReport);
router.get('/invoice/:orderId', exportInvoice);

module.exports = router;
