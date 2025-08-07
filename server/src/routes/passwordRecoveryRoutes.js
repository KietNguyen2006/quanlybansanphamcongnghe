const express = require('express');
const router = express.Router();
const passwordRecoveryController = require('../controllers/passwordRecoveryController');

// Gửi email khôi phục mật khẩu
router.post('/forgot-password', passwordRecoveryController.forgotPassword);
// Đặt lại mật khẩu mới
router.post('/reset-password', passwordRecoveryController.resetPassword);

module.exports = router;
