const { sequelize } = require('../src/models');

async function clearDatabase() {
  try {
    // Tắt kiểm tra khóa ngoại tạm thời
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

  
    // Xóa dữ liệu từ tất cả các bảng
    await sequelize.sync({ force: true });

    // Bật lại kiểm tra khóa ngoại
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });

    console.log('Đã xóa toàn bộ dữ liệu trong cơ sở dữ liệu');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu:', error);
    process.exit(1);
  }
}

clearDatabase();
