const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  createOrder,
  getUserOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

// Route đặt hàng cho phép khách không cần đăng nhập
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới (khách hoặc user đều đặt được)
 *     tags: [Order]
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
 *               customerName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               customerPhone:
 *                 type: string
 *                 example: "0912345678"
 *               customerDob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               customerAddress:
 *                 type: string
 *                 example: "123 Đường ABC, Quận 1, TP.HCM"
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 *       400:
 *         description: Lỗi đầu vào hoặc sản phẩm không đủ số lượng
 */
router.post('/', createOrder);

// Các route sau vẫn cần đăng nhập
router.use(protect);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Lấy lịch sử đơn hàng của user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của user
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/my-orders', getUserOrders);

// Admin only routes
router.use(authorize('admin'));

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng (admin)
 *     tags: [Order]
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
 *                 enum: [pending, processing, completed]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Lỗi đầu vào
 *       401:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.put('/:id/status', updateOrderStatus);

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Tạo đơn hàng và lấy link thanh toán MoMo
 *     tags: [Order]
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
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               customerDob:
 *                 type: string
 *                 format: date
 *               customerAddress:
 *                 type: string
 *           example:
 *             items:
 *               - productId: 1
 *                 quantity: 2
 *               - productId: 2
 *                 quantity: 1
 *             customerName: "Nguyễn Văn A"
 *             customerPhone: "0912345678"
 *             customerDob: "1990-01-01"
 *             customerAddress: "123 Đường ABC, Quận 1, TP.HCM"
 *     responses:
 *       200:
 *         description: Trả về link thanh toán MoMo (payUrl)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payUrl:
 *                   type: string
 *             example:
 *               payUrl: "https://momo.vn/pay/abcxyz"
 *       400:
 *         description: Lỗi đầu vào hoặc sản phẩm không đủ số lượng
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Xử lý callback thanh toán
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: 0 - thanh toán thành công, 1 - thanh toán thất bại
 *     responses:
 *       200:
 *         description: Xử lý kết quả thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xử lý kết quả thanh toán thành công"
 *       400:
 *         description: Lỗi xử lý callback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra khi xử lý thanh toán"
 */

module.exports = router;