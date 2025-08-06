const sequelize = require('./config/database');

// Kiểm tra kết nối database
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối database thành công!');
  })
  .catch(err => {
    console.error('Kết nối database thất bại:', err);
  });
  
const express = require('express');
const cors = require('cors');
require('dotenv').config();


// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const statsRoutes = require('./routes/statsRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
const exportRoutes = require('./routes/exportRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/export', exportRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import models để đảm bảo các model được đăng ký
const { syncModels } = require('./models');

// Khởi động server
const startServer = async () => {
  try {
    // Đồng bộ hóa database
    await syncModels();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`\n========================================`);
      console.log(`Server đang chạy trên cổng ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`========================================\n`);
    });
  } catch (error) {
    console.error('Không thể khởi động server:', error);
    process.exit(1);
  }
};

// Bắt đầu server
startServer();