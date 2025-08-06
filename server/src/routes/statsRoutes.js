const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
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
 *   name: Stats
 *   description: Thống kê và báo cáo
 */

// Tất cả routes đều cần quyền admin
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/stats/orders:
 *   get:
 *     summary: Lấy thống kê đơn hàng
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Thống kê đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 totalRevenue:
 *                   type: number
 *                   format: float
 *                 completedOrders:
 *                   type: integer
 *                 processingOrders:
 *                   type: integer
 *                 pendingOrders:
 *                   type: integer
 */
router.get('/orders', getOrderStats);

/**
 * @swagger
 * /api/stats/top-products:
 *   get:
 *     summary: Lấy danh sách sản phẩm bán chạy
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm cần lấy (mặc định 10)
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm bán chạy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                   totalSold:
 *                     type: integer
 *                   totalRevenue:
 *                     type: number
 *                     format: float
 *                   Product:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 */
router.get('/top-products', getTopProducts);

/**
 * @swagger
 * /api/stats/daily:
 *   get:
 *     summary: Lấy thống kê theo ngày
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Số ngày cần lấy dữ liệu (mặc định 7 ngày)
 *     responses:
 *       200:
 *         description: Thống kê theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                   orderCount:
 *                     type: integer
 *                   revenue:
 *                     type: number
 *                     format: float
 */
router.get('/daily', getDailyStats);

/**
 * @swagger
 * /api/stats/all-orders:
 *   get:
 *     summary: Lấy tất cả đơn hàng (phân trang)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang (mặc định 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mỗi trang (mặc định 10)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, cancelled]
 *         description: Lọc theo trạng thái đơn hàng
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 */
router.get('/all-orders', getAllOrders);

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         totalAmount:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, cancelled]
 *         User:
 *           $ref: '#/components/schemas/User'
 *         OrderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *           format: float
 *         Product:
 *           $ref: '#/components/schemas/Product'
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         imageUrl:
 *           type: string
 */

module.exports = router;