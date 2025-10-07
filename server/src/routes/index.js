const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/stats', require('./statsRoutes'));
router.use('/export', require('./exportRoutes'));

// Thêm các định tuyến bị thiếu
router.use('/brands', require('./brandRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/password', require('./passwordRecoveryRoutes'));
router.use('/notifications', require('./notificationRoutes'));

module.exports = router;
