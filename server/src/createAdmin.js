const sequelize = require('./config/database');
const { User } = require('./models');

async function createAdmin() {
  try {
    // Đảm bảo database đã được sync
    await sequelize.sync({ force: true });
    console.log('Database đã được reset và sync thành công!');

    // Tạo tài khoản admin
    const adminUser = await User.findOrCreate({
      where: { email: 'nxak1505@gmail.com' },
      defaults: {
        username: 'admin',
        email: 'nxak1505@gmail.com',
        password: 'Kiet15052006@',
        role: 'admin',
        status: 'active'
      }
    });

    if (adminUser[1]) {
      console.log('✅ Tài khoản admin đã được tạo thành công!');
      console.log('Email: nxak1505@gmail.com');
      console.log('Password: Kiet15052006@');
    } else {
      console.log('✅ Tài khoản admin đã tồn tại!');
    }

    // Tạo một số dữ liệu mẫu
    const { Product } = require('./models');
    
    await Product.bulkCreate([
      {
        name: 'iPhone 15 Pro',
        description: 'Điện thoại thông minh cao cấp',
        price: 25000000,
        category: 'Điện thoại',
        stock: 50,
        status: 'active'
      },
      {
        name: 'MacBook Pro M3',
        description: 'Laptop cao cấp cho công việc',
        price: 45000000,
        category: 'Laptop',
        stock: 30,
        status: 'active'
      },
      {
        name: 'iPad Air',
        description: 'Máy tính bảng đa năng',
        price: 15000000,
        category: 'Máy tính bảng',
        stock: 25,
        status: 'active'
      }
    ]);

    console.log('✅ Dữ liệu mẫu đã được tạo thành công!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error);
    process.exit(1);
  }
}

createAdmin(); 