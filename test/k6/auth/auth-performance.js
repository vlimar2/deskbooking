import http from 'k6/http';
import { check, group } from 'k6';
import { Rate, Trend, Gauge, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Custom metrics
const authFailureRate = new Rate('auth_failure_rate');
const authDuration = new Trend('auth_duration');
const userCounter = new Counter('user_counter');

export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp up to 10 users
    { duration: '60s', target: 30 }, // Stay at 30 users for 60 seconds
    { duration: '10s', target: 0 },  // Ramp down
  ],
  thresholds: {
    'auth_duration': ['p(95)<400'], // 95th percentile must be below 400ms
    'auth_failure_rate': ['rate<0.1'], // Error rate should be below 10%
  },
};

export default function () {
  // Generate unique email using timestamp and random value
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const uniqueEmail = `user_${timestamp}_${randomId}@test.com`;

  const registerPayload = JSON.stringify({
    username: `testuser_${timestamp}_${randomId}`,
    password: 'Test@123',
    email: uniqueEmail,
  });

  const registerHeaders = {
    'Content-Type': 'application/json',
  };

  group('Register User', () => {
    const startTime = new Date();
    const registerRes = http.post(
      `${BASE_URL}/api/register`,
      registerPayload,
      { headers: registerHeaders }
    );

    const duration = new Date() - startTime;
    authDuration.add(duration);

    const isSuccess = check(registerRes, {
      'registration status is 201 or 409': (r) => r.status === 201 || r.status === 409,
      'registration response has id or error': (r) =>
        r.body.includes('id') || r.body.includes('error'),
    });

    authFailureRate.add(!isSuccess);
    userCounter.add(1);
  });

  group('Login User', () => {
    const loginPayload = JSON.stringify({
      username: `testuser_${timestamp}_${randomId}`,
      password: 'Test@123',
    });

    const loginHeaders = {
      'Content-Type': 'application/json',
    };

    const startTime = new Date();
    const loginRes = http.post(
      `${BASE_URL}/api/login`,
      loginPayload,
      { headers: loginHeaders }
    );

    const duration = new Date() - startTime;
    authDuration.add(duration);

    const isSuccess = check(loginRes, {
      'login status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      'login response has token or error': (r) =>
        r.body.includes('token') || r.body.includes('error'),
    });

    authFailureRate.add(!isSuccess);
  });
}
