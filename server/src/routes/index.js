const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/stats', require('./statsRoutes'));
router.use('/vouchers', require('./voucherRoutes'));
router.use('/export', require('./exportRoutes'));

module.exports = router;
