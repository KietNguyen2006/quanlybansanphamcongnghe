
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
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import models để đảm bảo các model được đăng ký
const { syncModels } = require('./models');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Tài liệu API',
      version: '1.0.0',
      description: 'API cho dự án của tôi'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Khởi động server nếu không phải môi trường test
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await syncModels();
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`Server đang chạy trên cổng ${PORT}`);
        console.log(`Tài liệu API: http://localhost:${PORT}/api-docs`);
        console.log(`========================================\n`);
      });
    } catch (error) {
      console.error('Lỗi đồng bộ hóa cơ sở dữ liệu:', error);
      process.exit(1);
    }
  };
  startServer();
}
