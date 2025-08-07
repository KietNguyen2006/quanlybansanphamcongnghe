const { User, PasswordResetToken } = require('../models');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/emailService');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 1000 * 60 * 30; // 30 phút
    await PasswordResetToken.create({ userId: user.id, token, expiresAt });
    await sendResetEmail(user.email, token);
    res.json({ message: 'Đã gửi email khôi phục mật khẩu' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const resetToken = await PasswordResetToken.findOne({ where: { token } });
    if (!resetToken || resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    const user = await User.findByPk(resetToken.userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    user.password = newPassword;
    await user.save();
    await resetToken.destroy();
    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
