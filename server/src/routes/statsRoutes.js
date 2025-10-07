const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {
  getOrderStats,
  getTopProducts,
  getDailyStats,
  getAllOrders
} = require('../controllers/statsController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: API for retrieving statistics
 */

// Tất cả các định tuyến thống kê đều yêu cầu quyền admin
router.use(authenticate);
router.use(authorizeAdmin);

/**
 * @swagger
 * /api/stats/orders:
 *   get:
 *     summary: Get order statistics (Admin only)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An object containing order statistics.
 */
router.get('/orders', getOrderStats);

/**
 * @swagger
 * /api/stats/top-products:
 *   get:
 *     summary: Get top-selling products (Admin only)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of top-selling products.
 */
router.get('/top-products', getTopProducts);

/**
 * @swagger
 * /api/stats/daily:
 *   get:
 *     summary: Get daily statistics (Admin only)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An object containing daily statistics.
 */
router.get('/daily', getDailyStats);

/**
 * @swagger
 * /api/stats/all-orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all orders.
 */
router.get('/all-orders', getAllOrders);

module.exports = router;
