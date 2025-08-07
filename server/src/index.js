const sequelize = require('./config/database');

// Kiểm tra kết nối database
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối database thành công!');
  })
  .catch(err => {
    console.error('Kết nối database thất bại:', err);
  });

const app = require('./app');
require('dotenv').config();

// Import models để đảm bảo các model được đăng ký
const { syncModels } = require('./models');

// Khởi động server nếu không phải môi trường test
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await syncModels();
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`Server đang chạy trên cổng ${PORT}`);
        console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
        console.log(`========================================\n`);
      });
    } catch (error) {
      console.error('Error synchronizing database:', error);
      process.exit(1);
    }
  };
  startServer();
}

