const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Đăng ký các routes
app.use('/api', routes);

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Failed to synchronize database:', err);
  });

module.exports = app;