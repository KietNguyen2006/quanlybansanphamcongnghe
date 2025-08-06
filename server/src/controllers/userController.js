const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailSender = require('../../support/email.sender');

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
    try {
      const welcomeEmail = {
        email: user.email,
        subject: 'Chúc mừng! Tài khoản của bạn đã được tạo thành công',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50; text-align: center;">🎉 Chúc mừng bạn!</h2>
            <p>Xin chào <strong>${user.username}</strong>,</p>
            <p>Tài khoản của bạn đã được tạo thành công trên hệ thống quản lý bán hàng online.</p>
            <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #27ae60; margin-top: 0;">Thông tin tài khoản:</h3>
              <p><strong>Username:</strong> ${user.username}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Vai trò:</strong> ${user.role}</p>
            </div>
            <p>Bạn có thể bắt đầu sử dụng hệ thống ngay bây giờ!</p>
            <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
              Trân trọng,<br>
              Đội ngũ hỗ trợ
            </p>
          </div>
        `
      };
      
      await emailSender(welcomeEmail);
      console.log('Email chúc mừng đã được gửi thành công đến:', user.email);
    } catch (emailError) {
      console.error('Lỗi khi gửi email chúc mừng:', emailError.message);
      // Không throw error để không ảnh hưởng đến việc đăng ký
    }

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