const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID người dùng'
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Tên đăng nhập (3-50 ký tự)',
    validate: {
      len: [3, 50],
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Địa chỉ email',
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Mật khẩu đã được mã hóa (tối thiểu 6 ký tự)',
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  fullName: {
    type: DataTypes.STRING(100),
    comment: 'Họ và tên đầy đủ'
  },
  phone: {
    type: DataTypes.STRING(20),
    comment: 'Số điện thoại liên hệ (chỉ chứa số, dấu +, - và khoảng trắng)',
    validate: {
      is: /^[0-9+\-\s()]*$/i
    }
  },
  address: {
    type: DataTypes.TEXT,
    comment: 'Địa chỉ liên hệ'
  },
  avatar: {
    type: DataTypes.STRING,
    comment: 'Đường dẫn ảnh đại diện'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Trạng thái kích hoạt tài khoản'
  },
  lastLogin: {
    type: DataTypes.DATE,
    comment: 'Thời gian đăng nhập cuối cùng'
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    comment: 'Vai trò: user - người dùng thông thường, admin - quản trị viên'
  }
}, {
  indexes: [
    // Chỉ thêm index cho các trường cần tìm kiếm thường xuyên
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['email']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  // Tắt timestamps nếu không cần thiết
  timestamps: true,
  // Tắt paranoid nếu không cần soft delete
  paranoid: false
});

module.exports = User;