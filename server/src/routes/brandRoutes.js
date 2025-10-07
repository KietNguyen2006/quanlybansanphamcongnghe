const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: AKStore API
 *   description: API Manager AKStore
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Lấy tất cả thương hiệu
 *     tags: [Thương hiệu]
 *     responses:
 *       200:
 *         description: Một danh sách các thương hiệu.
 */
router.get('/', brandController.getAllBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Lấy một thương hiệu theo ID
 *     tags: [Thương hiệu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID thương hiệu
 *     responses:
 *       200:
 *         description: Thông tin chi tiết về thương hiệu.
 *       404:
 *         description: Không tìm thấy thương hiệu.
 */
router.get('/:id', brandController.getBrandById);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Tạo một thương hiệu mới (Chỉ quản trị viên)
 *     tags: [Thương hiệu]
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
 *     responses:
 *       201:
 *         description: Tạo thương hiệu thành công.
 */
router.post('/', authenticate, authorizeAdmin, brandController.createBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Cập nhật một thương hiệu (Chỉ quản trị viên)
 *     tags: [Thương hiệu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID thương hiệu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thương hiệu thành công.
 *       404:
 *         description: Không tìm thấy thương hiệu.
 */
router.put('/:id', authenticate, authorizeAdmin, brandController.updateBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Xóa một thương hiệu (Chỉ quản trị viên)
 *     tags: [Thương hiệu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID thương hiệu
 *     responses:
 *       200:
 *         description: Xóa thương hiệu thành công.
 *       404:
 *         description: Không tìm thấy thương hiệu.
 */
router.delete('/:id', authenticate, authorizeAdmin, brandController.deleteBrand);

module.exports = router;
