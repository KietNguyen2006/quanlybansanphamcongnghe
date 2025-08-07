const request = require('supertest');
const app = require('../app');
const { sequelize, Brand, User } = require('../models');
const bcrypt = require('bcryptjs');

// Bật logging cho tất cả các câu query SQL
sequelize.options.logging = console.log;

// Tắt logging khi chạy test
if (process.env.NODE_ENV === 'test') {
  sequelize.options.logging = false;
}

let testBrand;
let testUser;
let token;

beforeAll(async () => {
  try {
    console.log('Đang đồng bộ hóa database...');
    // Đồng bộ hóa database với force:true để xóa và tạo lại bảng
    await sequelize.sync({ force: true });
    
    console.log('Đang tạo người dùng test...');
    // Tạo người dùng test
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('Đang tạo dữ liệu test...');
    // Tạo dữ liệu test
    testBrand = await Brand.create({
      name: 'Test Brand',
      description: 'Test Description'
    });
    
    console.log('Đang đăng nhập để lấy token...');
    // Đăng nhập để lấy token
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'password123' });
      
    if (!loginRes.body.token) {
      console.error('Lỗi khi đăng nhập:', loginRes.body);
      throw new Error('Không thể lấy token đăng nhập');
    }
    
    token = loginRes.body.token;
    console.log('Chuẩn bị xong, bắt đầu chạy test...');
  } catch (error) {
    console.error('Lỗi trong beforeAll:', error);
    throw error; // Ném lỗi để Jest biết test bị lỗi
  }
});

describe('Brand API', () => {
  describe('GET /api/brands', () => {
    it('nên lấy tất cả các thương hiệu', async () => {
      try {
        const res = await request(app).get('/api/brands');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      } catch (error) {
        console.error('Lỗi trong test GET /api/brands:', error);
        throw error;
      }
    });
  });

  describe('GET /api/brands/:id', () => {
    it('nên lấy thông tin một thương hiệu', async () => {
      try {
        const res = await request(app).get(`/api/brands/${testBrand.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'Test Brand');
      } catch (error) {
        console.error('Lỗi trong test GET /api/brands/:id:', error);
        throw error;
      }
    });

    it('nên trả về lỗi nếu không tìm thấy thương hiệu', async () => {
      try {
        const res = await request(app).get('/api/brands/9999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Không tìm thấy thương hiệu');
      } catch (error) {
        console.error('Lỗi trong test GET /api/brands/:id (không tìm thấy):', error);
        throw error;
      }
    });
  });

  describe('POST /api/brands', () => {
    it('nên tạo mới thương hiệu thành công', async () => {
      try {
        const newBrand = {
          name: 'New Brand',
          description: 'New Brand Description'
        };
        const res = await request(app)
          .post('/api/brands')
          .set('Authorization', `Bearer ${token}`)
          .send(newBrand);
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', newBrand.name);
        expect(res.body).toHaveProperty('description', newBrand.description);
      } catch (error) {
        console.error('Lỗi trong test POST /api/brands:', error);
        throw error;
      }
    });

    it('nên trả về lỗi nếu thiếu tên thương hiệu', async () => {
      try {
        const res = await request(app)
          .post('/api/brands')
          .set('Authorization', `Bearer ${token}`)
          .send({ description: 'Missing name' });
        
        expect(res.statusCode).toBe(400);
      } catch (error) {
        console.error('Lỗi trong test POST /api/brands (thiếu tên):', error);
        throw error;
      }
    });
  });

  describe('PUT /api/brands/:id', () => {
    it('nên cập nhật thông tin thương hiệu', async () => {
      try {
        const updates = {
          name: 'Updated Brand',
          description: 'Updated Description'
        };
        const res = await request(app)
          .put(`/api/brands/${testBrand.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updates);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', updates.name);
        expect(res.body).toHaveProperty('description', updates.description);
      } catch (error) {
        console.error('Lỗi trong test PUT /api/brands/:id:', error);
        throw error;
      }
    });

    it('nên trả về lỗi nếu cập nhật thương hiệu không tồn tại', async () => {
      try {
        const res = await request(app)
          .put('/api/brands/9999')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Non-existent' });
        
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Không tìm thấy thương hiệu');
      } catch (error) {
        console.error('Lỗi trong test PUT /api/brands/:id (không tìm thấy):', error);
        throw error;
      }
    });
  });

  describe('DELETE /api/brands/:id', () => {
    it('nên xóa thương hiệu thành công', async () => {
      try {
        const brandToDelete = await Brand.create({
          name: 'To Be Deleted',
          description: 'Will be deleted'
        });
        
        const res = await request(app)
          .delete(`/api/brands/${brandToDelete.id}`)
          .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Xóa thương hiệu thành công');
        
        // Kiểm tra đã xóa trong database
        const deletedBrand = await Brand.findByPk(brandToDelete.id);
        expect(deletedBrand).toBeNull();
      } catch (error) {
        console.error('Lỗi trong test DELETE /api/brands/:id:', error);
        throw error;
      }
    });

    it('nên trả về lỗi nếu xóa thương hiệu không tồn tại', async () => {
      try {
        const res = await request(app)
          .delete('/api/brands/9999')
          .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Không tìm thấy thương hiệu');
      } catch (error) {
        console.error('Lỗi trong test DELETE /api/brands/:id (không tìm thấy):', error);
        throw error;
      }
    });
  });
});

afterAll(async () => {
  // Đóng kết nối database
  await sequelize.close();
});
