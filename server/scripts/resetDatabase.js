const { sequelize } = require('../src/models');
const fs = require('fs');
const path = require('path');

async function resetDatabase() {
  try {
    // Đọc file .env để lấy tên database
    const envPath = path.join(__dirname, '..', '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const dbName = envFile.match(/DB_NAME=(.+)/)[1];

    console.log('🔄 Đang xóa và tạo lại database...');
    
    // Tạo kết nối tới MySQL mà không chỉ định database
    const tempSequelize = new (require('sequelize'))(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
      }
    );

    // Xóa và tạo lại database
    await tempSequelize.getQueryInterface().dropDatabase(dbName);
    await tempSequelize.getQueryInterface().createDatabase(dbName);
    await tempSequelize.close();

    console.log('✅ Đã tạo lại database thành công');
    console.log('🔄 Đang đồng bộ hóa các bảng...');

    // Đồng bộ hóa tất cả các model
    const { syncModels } = require('../src/models');
    await syncModels();

    console.log('✅ Đã đồng bộ hóa các bảng thành công');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi đặt lại database:', error);
    process.exit(1);
  }
}

resetDatabase();
