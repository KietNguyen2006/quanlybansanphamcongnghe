const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  exportOrderStats,
  exportProductReport,
  exportInvoice
} = require('../controllers/excelController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Export
 *   description: Xuất dữ liệu ra file Excel
 */

// Tất cả routes đều cần đăng nhập và quyền admin
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/export/orders:
 *   get:
 *     summary: Xuất thống kê đơn hàng ra Excel
 *     tags: [Export]
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
 *         description: File Excel chứa thống kê đơn hàng
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/orders', exportOrderStats);

/**
 * @swagger
 * /api/export/products:
 *   get:
 *     summary: Xuất báo cáo doanh thu sản phẩm ra Excel
 *     tags: [Export]
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
 *         description: File Excel chứa báo cáo doanh thu sản phẩm
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/products', exportProductReport);

/**
 * @swagger
 * /api/export/invoice/{orderId}:
 *   get:
 *     summary: Xuất hóa đơn ra Excel
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đơn hàng
 *     responses:
 *       200:
 *         description: File Excel chứa hóa đơn
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get('/invoice/:orderId', exportInvoice);

module.exports = router;
