const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {
  createOrder,
  getUserOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Đơn hàng
 *   description: API để quản lý đơn hàng
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Đơn hàng]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công.
 */
router.post('/', createOrder);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Lấy lịch sử đơn hàng cho người dùng đã đăng nhập
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Một danh sách các đơn hàng của người dùng.
 */
router.get('/my-orders', authenticate, getUserOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái của một đơn hàng (Chỉ quản trị viên)
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái đơn hàng thành công.
 *       404:
 *         description: Không tìm thấy đơn hàng.
 */
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

module.exports = router;
