const request = require('supertest');
const app = require('../app');
const { sequelize, Category } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Category API', () => {
  let token;
  beforeAll(async () => {
    // Đăng nhập admin để lấy token
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'nxak1505@gmail.com', password: 'Kiet15052006@' });
    token = res.body.token;
  });

  it('Tạo mới danh mục', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Điện thoại', description: 'Danh mục điện thoại' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Điện thoại');
  });

  it('Lấy danh sách danh mục', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

afterAll(async () => {
  await sequelize.close();
});
