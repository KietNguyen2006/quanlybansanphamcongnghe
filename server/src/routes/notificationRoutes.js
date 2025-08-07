const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

// Xem thông báo của user
router.get('/', authenticate, notificationController.getNotifications);
// Gửi thông báo (admin)
router.post('/', authenticate, authorizeAdmin, notificationController.createNotification);
// Đánh dấu đã đọc
router.put('/:id', authenticate, notificationController.markAsRead);

module.exports = router;
