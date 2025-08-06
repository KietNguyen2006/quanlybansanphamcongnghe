const express = require('express');
const { register, login, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi đầu vào hoặc email đã tồn tại
 */
router.post('/register', register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả user (chỉ admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách user
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền thực hiện hành động này
 */
router.get('/', protect, authorize('admin'), getAllUsers); // Lấy danh sách user

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy chi tiết user theo id (chỉ admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin user
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền thực hiện hành động này
 *       404:
 *         description: Không tìm thấy user
 */
router.get('/:id', protect, authorize('admin'), getUserById); // Lấy chi tiết user

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật user (chỉ admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Cập nhật user thành công
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền thực hiện hành động này
 *       404:
 *         description: Không tìm thấy user
 */
router.put('/:id', protect, authorize('admin'), updateUser); // Cập nhật user

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xoá user (chỉ admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xoá user thành công
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không có quyền thực hiện hành động này
 *       404:
 *         description: Không tìm thấy user
 */
router.delete('/:id', protect, authorize('admin'), deleteUser); // Xoá user

module.exports = router;