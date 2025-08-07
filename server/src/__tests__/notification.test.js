const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Notification API', () => {
  let token;
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'nxak1505@gmail.com', password: 'Kiet15052006@' });
    token = res.body.token;
  });
  it('Gửi thông báo', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Thông báo mới', content: 'Nội dung thông báo' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Thông báo mới');
  });
});

afterAll(async () => {
  await sequelize.close();
});
