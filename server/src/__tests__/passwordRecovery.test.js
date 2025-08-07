const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models');

beforeAll(async () => {
  try {
    // Sử dụng syncModels thay vì gọi trực tiếp sequelize.sync
    await require('../models').syncModels();
    
    // Tạo dữ liệu test
    await User.create({ 
      username: 'testuser', 
      email: 'testuser@gmail.com', 
      password: '123456',
      full_name: 'Test User',
      phone: '0123456789',
      role: 'user'
    });
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
});

describe('Password Recovery API', () => {
  it('Gửi email khôi phục mật khẩu', async () => {
    const res = await request(app)
      .post('/api/forgot-password')
      .send({ email: 'testuser@gmail.com' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
  
  it('Không tìm thấy email', async () => {
    const res = await request(app)
      .post('/api/forgot-password')
      .send({ email: 'nonexistent@example.com' });
    
    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  try {
    // Xóa dữ liệu test
    await User.destroy({ where: { email: 'testuser@gmail.com' }, force: true });
    
    // Đóng kết nối database
    await sequelize.close();
  } catch (error) {
    console.error('Error cleaning up test:', error);
  }
});
