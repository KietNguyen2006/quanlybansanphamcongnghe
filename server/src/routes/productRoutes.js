const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/productController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sản phẩm
 *   description: API để quản lý sản phẩm
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang cần lấy
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm cần lấy trên mỗi trang
 *     responses:
 *       200:
 *         description: Một danh sách sản phẩm.
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Truy vấn tìm kiếm
 *     responses:
 *       200:
 *         description: Một danh sách sản phẩm phù hợp.
 */
router.get('/search', searchProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy một sản phẩm theo ID
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Thông tin chi tiết về sản phẩm.
 *       404:
 *         description: Không tìm thấy sản phẩm.
 */
router.get('/:id', getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo một sản phẩm mới (Chỉ quản trị viên)
 *     tags: [Sản phẩm]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               brandId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công.
 *       400:
 *         description: Yêu cầu không hợp lệ.
 *       401:
 *         description: Không được phép.
 *       403:
 *         description: Bị cấm.
 */
router.post('/', authenticate, authorizeAdmin, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật một sản phẩm (Chỉ quản trị viên)
 *     tags: [Sản phẩm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công.
 *       404:
 *         description: Không tìm thấy sản phẩm.
 */
router.put('/:id', authenticate, authorizeAdmin, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Xóa một sản phẩm (Chỉ quản trị viên)
 *     tags: [Sản phẩm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công.
 *       404:
 *         description: Không tìm thấy sản phẩm.
 */
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
