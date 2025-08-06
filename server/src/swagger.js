const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Quản lý bán hàng online',
      version: '1.0.0',
      description: `Tài liệu API cho hệ thống quản lý bán hàng online.

**Các nhóm chức năng chính:**
- User: Đăng ký, đăng nhập, phân quyền, quản lý tài khoản
- Product: Quản lý sản phẩm, tìm kiếm, lọc, phân trang
- Order: Đặt hàng, quản lý đơn hàng, và thanh toán
- Cart: Quản lý giỏ hàng
- Stats: Thống kê, báo cáo
- Voucher: Quản lý mã giảm giá

**Phân quyền:**
- Một số endpoint yêu cầu JWT (bearer token) và quyền admin/user. Xem mục security trong từng endpoint.

**Response mẫu:**
- Các response đều trả về JSON, có thể gồm message, data, error, ...

**Hướng dẫn sử dụng:**
- Đăng nhập để lấy token, nhấn Authorize trên Swagger UI để test các endpoint bảo vệ.
- Tham khảo ví dụ request/response trong từng endpoint.
`,
    },
    servers: [
      {
        url: 'http://localhost:3000',
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