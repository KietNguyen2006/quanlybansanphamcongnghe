const { Notification } = require('../models');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Lấy từ người dùng đã xác thực
    const notification = await Notification.create({ title, content, userId });
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({ where: { id, userId } });

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo hoặc bạn không có quyền' });
    }

    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
