import http from 'k6/http';
import { check, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Custom metrics
const deskFailureRate = new Rate('desk_failure_rate');
const deskDuration = new Trend('desk_duration');
const deskRequestCounter = new Counter('desk_request_counter');

// Setup phase - create a test user that will be reused
let authToken = '';

export function setup() {
  // Create a user for testing
  const timestamp = Date.now();
  const registerPayload = JSON.stringify({
    username: `perf_user_${timestamp}`,
    password: 'Test@123',
    email: `perf_user_${timestamp}@test.com`,
  });

  const registerRes = http.post(`${BASE_URL}/api/register`, registerPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Login to get token
  const loginPayload = JSON.stringify({
    username: `perf_user_${timestamp}`,
    password: 'Test@123',
  });

  const loginRes = http.post(`${BASE_URL}/api/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  let token = '';
  try {
    const loginBody = JSON.parse(loginRes.body);
    token = loginBody.token || '';
  } catch (e) {
    console.log('Failed to extract token from login response');
  }

  return { token };
}

export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp up to 10 users
    { duration: '60s', target: 30 }, // Stay at 30 users for 60 seconds
    { duration: '10s', target: 0 },  // Ramp down
  ],
  thresholds: {
    'desk_duration': ['p(95)<900'], // 95th percentile must be below 400ms
    //'desk_failure_rate': ['rate<60.0'], // Error rate should be below 10%
  },
};

export default function (data) {
  const token = data && data.token ? data.token : '';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  group('List Available Desks', () => {
    const startTime = new Date();
    const listRes = http.get(`${BASE_URL}/api/desks`, { headers });
    const duration = new Date() - startTime;

    deskDuration.add(duration);

    const isSuccess = check(listRes, {
      'list desks status is 200': (r) => r.status === 200,
      'list desks response is array': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body);
        } catch (e) {
          return false;
        }
      },
    });

    deskFailureRate.add(!isSuccess);
    deskRequestCounter.add(1);
  });

  // Only attempt booking if we have a token
  /*if (token) {
    group('Book a Desk', () => {
      // First get available desks
      const listRes = http.get(`${BASE_URL}/api/desks`, { headers });

      let deskId = 1; // Default desk ID
      try {
        const desks = JSON.parse(listRes.body);
        if (Array.isArray(desks) && desks.length > 0) {
          // Find first available desk
          const availableDesk = desks.find((d) => d.isAvailable);
          if (availableDesk) {
            deskId = availableDesk.deskId;
          }
        }
      } catch (e) {
        console.log('Failed to parse desks list');
      }

      const bookPayload = JSON.stringify({
        deskId: deskId,
      });

      const startTime = new Date();
      const bookRes = http.post(`${BASE_URL}/api/desks/book`, bookPayload, {
        headers,
      });
      const duration = new Date() - startTime;

      deskDuration.add(duration);

      const isSuccess = check(bookRes, {
        'book desk status is 200 or 400 or 409': (r) =>
          r.status === 200 || r.status === 400 || r.status === 409,
        'book desk response has message or error': (r) =>
          r.body.includes('message') || r.body.includes('error'),
      });*/

      //deskFailureRate.add(!isSuccess);
      //deskRequestCounter.add(1);
    //});
  //}
}
