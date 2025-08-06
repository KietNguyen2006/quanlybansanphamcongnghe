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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});