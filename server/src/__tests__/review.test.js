const request = require('supertest');
const app = require('../app');
const { sequelize, Product } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Review & Comment API', () => {
  let token, productId;
  beforeAll(async () => {
    // Đăng nhập admin để lấy token
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'nxak1505@gmail.com', password: 'Kiet15052006@' });
    token = res.body.token;
    // Tạo sản phẩm mẫu
    const product = await Product.create({ name: 'iPhone', price: 1000, categoryId: 1, brandId: 1, stock: 10 });
    productId = product.id;
  });
  it('Đánh giá sản phẩm', async () => {
    const res = await request(app)
      .post(`/api/products/${productId}/reviews`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5, comment: 'Tốt!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.rating).toBe(5);
  });
  it('Bình luận sản phẩm', async () => {
    const res = await request(app)
      .post(`/api/products/${productId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Bình luận hay!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe('Bình luận hay!');
  });
});

afterAll(async () => {
  await sequelize.close();
});
