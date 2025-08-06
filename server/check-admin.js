const { User } = require('./src/models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAndCreateAdmin() {
  try {
    // Kiểm tra kết nối database
    const sequelize = require('./src/config/database');
    await sequelize.authenticate();
    console.log('Kết nối database thành công!');

    // Kiểm tra xem có user admin nào không
    const adminUser = await User.findOne({ where: { email: 'admindepchai@gmail.com' } });
    
    if (adminUser) {
      console.log('Tài khoản admin đã tồn tại:');
      console.log('Username:', adminUser.username);
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
      
      // Kiểm tra mật khẩu
      const testPassword = 'admindepchai';
      const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Mật khẩu "admindepchai" có hợp lệ:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('Cập nhật mật khẩu cho admin...');
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(testPassword, salt);
        await adminUser.save();
        console.log('Đã cập nhật mật khẩu thành công!');
      }
    } else {
      console.log('Tạo tài khoản admin mới...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admindepchai', salt);
      
      const newAdmin = await User.create({
        username: 'admindepchai',
        email: 'admindepchai@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Đã tạo tài khoản admin thành công:');
      console.log('Username:', newAdmin.username);
      console.log('Email:', newAdmin.email);
      console.log('Role:', newAdmin.role);
    }
    
    // Liệt kê tất cả user
    const allUsers = await User.findAll({ attributes: ['id', 'username', 'email', 'role'] });
    console.log('\nDanh sách tất cả user:');
    allUsers.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    process.exit(0);
  }
}

checkAndCreateAdmin(); 