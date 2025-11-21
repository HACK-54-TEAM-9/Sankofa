const request = require('supertest');
const app = require('../src/server');

describe('Analytics API Tests', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Login to get auth token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword123'
      });

    if (loginRes.status === 200) {
      authToken = loginRes.body.token;
      testUserId = loginRes.body.data.user.id;
    }
  });

  describe('GET /api/analytics/dashboard', () => {
    it('should return dashboard statistics', async () => {
      const res = await request(app)
        .get('/api/analytics/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalCollections');
      expect(res.body.data).toHaveProperty('totalPlastic');
      expect(res.body.data).toHaveProperty('totalEarnings');
      expect(res.body.data).toHaveProperty('activeCollectors');
    });
  });

  describe('GET /api/analytics/collections', () => {
    it('should return collection analytics', async () => {
      const res = await request(app)
        .get('/api/analytics/collections')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('summary');
      expect(res.body.data).toHaveProperty('trends');
      expect(res.body.data).toHaveProperty('plasticTypeDistribution');
    });
  });

  describe('GET /api/analytics/environmental-impact', () => {
    it('should return environmental impact calculations', async () => {
      const res = await request(app)
        .get('/api/analytics/environmental-impact')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('co2Prevented');
      expect(res.body.data).toHaveProperty('waterSaved');
      expect(res.body.data).toHaveProperty('energySaved');
    });
  });

  describe('GET /api/analytics/health', () => {
    it('should return health analytics', async () => {
      const res = await request(app)
        .get('/api/analytics/health')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('summary');
    });
  });

  describe('GET /api/analytics/predictions', () => {
    it('should return predictive insights', async () => {
      const res = await request(app)
        .get('/api/analytics/predictions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ days: 30 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('predictions');
    });
  });

  describe('GET /api/analytics/top-collectors', () => {
    it('should return top collectors', async () => {
      const res = await request(app)
        .get('/api/analytics/top-collectors')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.collectors)).toBe(true);
    });
  });

  describe('GET /api/analytics/location', () => {
    it('should return location-based analytics', async () => {
      const res = await request(app)
        .get('/api/analytics/location')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ location: 'Accra' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/analytics/trends', () => {
    it('should return trend analysis', async () => {
      const res = await request(app)
        .get('/api/analytics/trends')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ period: '30d' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('trends');
    });
  });
});
