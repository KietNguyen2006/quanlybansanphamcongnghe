const bcrypt = require('bcryptjs');
const { User } = require('./models');
const sequelize = require('./config/database');

async function createOrUpdateAdmin() {
  await sequelize.sync({ alter: true }); // Sync database schema
  const email = 'nxak1505@gmail.com';
  const password = 'Akstore2006@lhu';
  const hash = await bcrypt.hash(password, 10);
  let admin = await User.findOne({ where: { email } });
  if (admin) {
    admin.password = hash;
    admin.role = 'admin';
    await admin.save();
    console.log('Đã cập nhật lại mật khẩu admin:', email);
  } else {
    await User.create({
      username: 'admin',
      email,
      password: hash,
      role: 'admin',
    });
    console.log('Đã tạo admin mới:', email);
  }
  process.exit();
}

createOrUpdateAdmin();