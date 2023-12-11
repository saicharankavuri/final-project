// server.test.js
const fetch = require('node-fetch');

const app = require('./server');

// ... rest of your test code ...

describe('POST /signup', () => {
  it('should create a new user', async () => {
    const response = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('user');
    expect(responseBody).toHaveProperty('token');
  });

  it('should sign in an existing user', async () => {
    const response = await fetch('http://localhost:3001/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('user');
    expect(responseBody).toHaveProperty('token');
  });
});

// Add more test cases for other routes and functionality
