// server.test.js
const request = require('supertest');
const app = require('./server'); // Adjust the path based on your project structure

describe('POST /signup', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });
});

// Add more test cases for other routes and functionality
