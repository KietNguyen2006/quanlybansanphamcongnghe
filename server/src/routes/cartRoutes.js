const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy giỏ hàng của user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin giỏ hàng
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/', getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Đã thêm vào giỏ hàng
 *       400:
 *         description: Lỗi đầu vào hoặc sản phẩm không đủ số lượng
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/add', addToCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Đã cập nhật giỏ hàng
 *       400:
 *         description: Lỗi đầu vào hoặc sản phẩm không đủ số lượng
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 */
router.put('/:productId', updateCartItem);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Đã xóa sản phẩm khỏi giỏ hàng
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 */
router.delete('/:productId', removeFromCart);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Xóa toàn bộ giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đã xóa giỏ hàng
 *       401:
 *         description: Chưa đăng nhập
 */
router.delete('/', clearCart);

module.exports = router; 