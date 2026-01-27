const request = require('supertest');
const { expect } = require('chai');
const users = require('../fixtures/users.json');
const desks = require('../fixtures/desks.json');
const app = require('../../src/app');
const { desks: desksDB } = require('../../src/model/db');
require('dotenv').config();

let authToken;

describe('Desk Management Tests', () => {
  before(async () => {
    // Register and login to get token
    await request(app)
      .post('/api/register')
      .send(users.validUser);
    
    const loginRes = await request(app)
      .post('/api/login')
      .send(users.validUser);
    
    authToken = loginRes.body.token;
  });

  beforeEach(() => {
    // Reset desks before each test
    desksDB.length = 0; // Clear the array
    require('../../src/service/deskService').seedDesks(10); // Re-seed desks
  });

  describe('List Available Desks', () => {
    it('should list available desks when authenticated', async () => {
      const res = await request(app)
        .get('/api/desks')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('isAvailable', true);
    });

    it('should fail when listing desks without authentication', async () => {
      const res = await request(app)
        .get('/api/desks');
      
      expect(res.status).to.equal(401);
    });

    it('should handle case when all desks are booked', async () => {
      // First book all available desks
      const availableDesks = await request(app)
        .get('/api/desks')
        .set('Authorization', `Bearer ${authToken}`);

      for (let desk of availableDesks.body) {
        await request(app)
          .post('/api/reserve')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ deskId: desk.id });
      }

      // Try to get available desks
      const res = await request(app)
        .get('/api/desks')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  });

  describe('Desk Reservation', () => {
    it('should book a desk with valid information', async () => {
      const res = await request(app)
        .post('/api/reserve')
        .set('Authorization', `Bearer ${authToken}`)
        .send(desks.validDesk);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('isAvailable', false);
      expect(res.body).to.have.property('reservedBy');
    });

    it('should fail when booking unavailable desk', async () => {
      // First book the desk
      await request(app)
        .post('/api/reserve')
        .set('Authorization', `Bearer ${authToken}`)
        .send(desks.validDesk);

      // Try to book same desk again
      const res = await request(app)
        .post('/api/reserve')
        .set('Authorization', `Bearer ${authToken}`)
        .send(desks.validDesk);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
    });

    it('should fail when booking with invalid desk id', async () => {
      const res = await request(app)
        .post('/api/reserve')
        .set('Authorization', `Bearer ${authToken}`)
        .send(desks.invalidDesk);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
    });

    it('should fail when booking without desk id', async () => {
      const res = await request(app)
        .post('/api/reserve')
        .set('Authorization', `Bearer ${authToken}`)
        .send(desks.missingFields);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error');
    });

    it('should fail when booking with invalid token', async () => {
      const res = await request(app)
        .post('/api/reserve')
        .set('Authorization', 'Bearer invalid-token')
        .send(desks.validDesk);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('error');
    });
  });
});