const request = require('supertest');
const { expect } = require('chai');
const users = require('../fixtures/users.json');
const app = require('../../src/app');
const { users: usersDB } = require('../../src/model/db');
require('dotenv').config();

describe('User Registration Tests', () => {
  it.only('should handle all user registration scenarios', async () => {
    const scenarios = [
      { id: 1, username: 'valid', password: 'valid', shouldCreate: true },
      { id: 2, username: 'valid', password: 'invalid', shouldCreate: false },
      { id: 3, username: 'valid', password: 'missing', shouldCreate: false },
      { id: 4, username: 'invalid', password: 'valid', shouldCreate: false },
      { id: 5, username: 'invalid', password: 'invalid', shouldCreate: false },
      { id: 6, username: 'invalid', password: 'missing', shouldCreate: false },
      { id: 7, username: 'missing', password: 'valid', shouldCreate: false },
      { id: 8, username: 'missing', password: 'invalid', shouldCreate: false },
      { id: 9, username: 'missing', password: 'missing', shouldCreate: false },
    ];

    for (const scenario of scenarios) {
      const username = scenario.username === 'valid'
        ? `registration-case-${scenario.id}`
        : scenario.username === 'invalid' ? '' : undefined;
      const password = scenario.password === 'valid'
        ? users.validUser.password
        : scenario.password === 'invalid' ? '' : undefined;
      const payload = {};

      if (username !== undefined) payload.username = username;
      if (password !== undefined) payload.password = password;

      const userCountBefore = usersDB.length;
      const res = await request(app)
        .post('/api/register')
        .send(payload);

      if (scenario.shouldCreate) {
        expect(res.status, `case ${scenario.id}`).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('username', username);
        expect(usersDB).to.have.length(userCountBefore + 1);
      } else {
        expect(res.status, `case ${scenario.id}`).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(usersDB).to.have.length(userCountBefore);
      }
    }
  });
});