const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../utils/emailService');

// Tạo token JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({
      username,
      email,
      password
    });

    const token = createToken(user.id);

    // Gửi email chúc mừng
    await sendWelcomeEmail(user.email, user.username);

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = createToken(user.id);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy danh sách tất cả user (chỉ admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết 1 user theo id (chỉ admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật user (chỉ admin)
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    res.json({ message: 'Cập nhật user thành công', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xoá user (chỉ admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    await user.destroy();
    res.json({ message: 'Xoá user thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};