// File: server.test.js

const request = require('supertest');
require('text-encoding');

const app = require('../server.js'); // Replace with the actual path to your server file

test('fails to create an expense without authentication', async () => {
  const response = await request(app)
    .post('/confBudget')
    .send({ description: 'Test Expense', amount: 100 });

  expect(response.status).toBe(401);
  // Add more assertions based on your response structure
});
