const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
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
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   imageUrl:
 *                     type: string
 *             example:
 *               - id: 1
 *                 name: "Laptop Dell XPS 13"
 *                 price: 25000000
 *                 imageUrl: "https://example.com/xps13.jpg"
 *               - id: 2
 *                 name: "Chuột Logitech G102"
 *                 price: 350000
 *                 imageUrl: "https://example.com/g102.jpg"
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Tìm kiếm và lọc sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Tên sản phẩm
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Danh mục
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm phù hợp
 */
router.get('/search', searchProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get('/:id', getProduct);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Thêm sản phẩm mới (admin)
 *     tags: [Product]
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
 *               imageUrl:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Thêm sản phẩm thành công
 *       400:
 *         description: Lỗi đầu vào
 *       401:
 *         description: Không có quyền
 */
router.post('/', createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm (admin)
 *     tags: [Product]
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
 *               imageUrl:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi đầu vào
 *       401:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put('/:id', updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm (admin)
 *     tags: [Product]
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
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.delete('/:id', deleteProduct);


module.exports = router; 