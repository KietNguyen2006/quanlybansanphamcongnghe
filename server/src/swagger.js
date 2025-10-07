const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hệ thống quản lý bán hàng online - Backend',
      version: '1.1.0',
      description: `Đây là tài liệu API cho backend của hệ thống quản lý bán hàng online.

**Công nghệ sử dụng:**
- **Backend:** Node.js, Express, Sequelize
- **Database:** MySQL
- **API Documentation:** Swagger UI

---

### Chức năng người dùng (User)
- Đăng ký, đăng nhập
- Xem danh sách sản phẩm
- Tìm kiếm và lọc sản phẩm theo danh mục, giá
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng (tạo đơn hàng)
- Xem lịch sử đơn hàng
- Đánh giá & bình luận sản phẩm
- Nhận thông báo từ hệ thống
- Khôi phục mật khẩu qua email

### Chức năng quản trị viên (Admin)
- Đăng nhập admin riêng
- CRUD sản phẩm (tên, mô tả, giá, hình ảnh)
- Quản lý đơn hàng (thay đổi trạng thái: mới → đang xử lý → đã giao)
- Thống kê đơn hàng, doanh thu, sản phẩm bán chạy, báo cáo tổng hợp
- Quản lý danh mục (Category) & thương hiệu (Brand)
- Quản lý voucher/khuyến mãi
- Quản lý đánh giá & bình luận
- Gửi thông báo cho người dùng
`,
      contact: {
        name: "Nguyễn Xuân Anh Kiệt",
        email: "nxak1505@gmail.com"
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
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
  apis: ['./src/routes/*.js', './src/app.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
