const express = require('express');
const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Người dùng
 *   description: API để quản lý người dùng
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Người dùng]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Người dùng đã đăng ký thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post('/register', register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Người dùng]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về một mã thông báo JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Thông tin đăng nhập không hợp lệ
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy tất cả người dùng (Chỉ quản trị viên)
 *     tags: [Người dùng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Một danh sách người dùng
 *       401:
 *         description: Không được phép
 *       403:
 *         description: Bị cấm
 */
router.get('/', authenticate, authorizeAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy người dùng theo ID (Chỉ quản trị viên)
 *     tags: [Người dùng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       404:
 *         description: Người dùng không tồn tại
 */
router.get('/:id', authenticate, authorizeAdmin, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật người dùng (Chỉ quản trị viên)
 *     tags: [Người dùng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật người dùng thành công
 *       404:
 *         description: Người dùng không tồn tại
 */
router.put('/:id', authenticate, authorizeAdmin, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng (Chỉ quản trị viên)
 *     tags: [Người dùng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       404:
 *         description: Người dùng không tồn tại
 */
router.delete('/:id', authenticate, authorizeAdmin, deleteUser);

module.exports = router;
