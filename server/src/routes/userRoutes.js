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

// Các định tuyến công khai
router.post('/register', register);
router.post('/login', login);

// Các định tuyến chỉ dành cho Admin
router.get('/', authenticate, authorizeAdmin, getAllUsers); // Lấy danh sách user
router.get('/:id', authenticate, authorizeAdmin, getUserById); // Lấy chi tiết user
router.put('/:id', authenticate, authorizeAdmin, updateUser); // Cập nhật user
router.delete('/:id', authenticate, authorizeAdmin, deleteUser); // Xoá user

module.exports = router;