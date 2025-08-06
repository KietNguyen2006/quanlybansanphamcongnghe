const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Quản lý bán hàng online',
      version: '1.0.0',
      description: 'Tài liệu API cho hệ thống quản lý bán hàng online',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], // Quét các file route để lấy swagger comment
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 