const request = require('supertest');
const { expect } = require('chai');
const users = require('../fixtures/users.json');
const app = require('../../src/app');
require('dotenv').config();

let authToken;

describe('Authentication Tests', () => {
  describe('User Registration', () => {
    it('should register with valid data', async () => {
      const res = await request(app)
        .post('/api/register')
        .send(users.validUser);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('username', users.validUser.username);
    });

    it('should fail when registering existing user', async () => {
      // First registration
      await request(app)
        .post('/api/register')
        .send(users.validUser);

      // Try to register same user again
      const res = await request(app)
        .post('/api/register')
        .send(users.validUser);
      
      expect(res.status).to.equal(409);
      expect(res.body).to.have.property('error');
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/register')
        .send(users.missingFields);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('User Login', () => {
    before(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/api/register')
        .send(users.validUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send(users.validUser);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      authToken = res.body.token; // Save token for other tests
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send(users.invalidUser);
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('error');
    });

    it('should maintain session within token validity', async () => {
      const res = await request(app)
        .get('/api/desks')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
    });
  });
});