const request = require('supertest');
const app = require('../src/server');

describe('Health API Tests', () => {
  let authToken;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword123'
      });

    if (loginRes.status === 200) {
      authToken = loginRes.body.token;
    }
  });

  describe('GET /api/health/impact-analysis', () => {
    it('should return correlation analysis between plastic and health', async () => {
      const res = await request(app)
        .get('/api/health/impact-analysis')
        .query({ timeRange: '90d' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.analysis).toHaveProperty('correlation');
      expect(res.body.data.analysis).toHaveProperty('metrics');
      expect(res.body.data.analysis).toHaveProperty('environmentalImpact');
      expect(res.body.data.analysis).toHaveProperty('diseasePatterns');
      expect(res.body.data.analysis).toHaveProperty('insights');
    });

    it('should filter by location', async () => {
      const res = await request(app)
        .get('/api/health/impact-analysis')
        .query({ location: 'Accra', timeRange: '90d' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.analysis.location).toContain('Accra');
    });
  });

  describe('GET /api/health/predictive', () => {
    it('should return predictive health insights', async () => {
      const res = await request(app)
        .get('/api/health/predictive')
        .query({ days: 30 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('predictions');
      expect(res.body.data).toHaveProperty('trends');
      expect(res.body.data).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.data.predictions)).toBe(true);
    });

    it('should include emerging diseases', async () => {
      const res = await request(app)
        .get('/api/health/predictive')
        .query({ days: 30 });

      expect(res.status).toBe(200);
      if (res.body.data.emergingDiseases) {
        expect(Array.isArray(res.body.data.emergingDiseases)).toBe(true);
      }
    });
  });

  describe('GET /api/health/insights', () => {
    it('should return health insights', async () => {
      const res = await request(app)
        .get('/api/health/insights');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/health/trends', () => {
    it('should return health trends', async () => {
      const res = await request(app)
        .get('/api/health/trends');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/health/high-risk-areas', () => {
    it('should return high-risk areas', async () => {
      const res = await request(app)
        .get('/api/health/high-risk-areas');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/health/disease-patterns', () => {
    it('should return disease patterns', async () => {
      const res = await request(app)
        .get('/api/health/disease-patterns');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/health/environmental', () => {
    it('should return environmental health data', async () => {
      const res = await request(app)
        .get('/api/health/environmental');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('Health Data Model Tests', () => {
  let authToken;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword123'
      });

    if (loginRes.status === 200) {
      authToken = loginRes.body.token;
    }
  });

  describe('HealthData.getHealthStats', () => {
    it('should return comprehensive health statistics', async () => {
      const HealthData = require('../src/models/HealthData');
      const stats = await HealthData.getHealthStats();

      expect(stats).toHaveProperty('overview');
      expect(stats).toHaveProperty('bySource');
      expect(stats).toHaveProperty('riskDistribution');
      expect(stats).toHaveProperty('diseases');
      expect(stats).toHaveProperty('locations');
      expect(stats).toHaveProperty('trends');
      expect(stats).toHaveProperty('data_quality');
    });
  });

  describe('HealthData.getDiseaseTrends', () => {
    it('should return disease trends over time', async () => {
      const HealthData = require('../src/models/HealthData');
      const trends = await HealthData.getDiseaseTrends();

      expect(trends).toHaveProperty('time_range');
      expect(trends).toHaveProperty('weekly_overview');
      expect(trends).toHaveProperty('top_diseases');
      expect(trends).toHaveProperty('summary');
      expect(Array.isArray(trends.weekly_overview)).toBe(true);
    });

    it('should filter by specific disease', async () => {
      const HealthData = require('../src/models/HealthData');
      const trends = await HealthData.getDiseaseTrends('Malaria');

      expect(trends).toHaveProperty('disease');
      expect(trends.disease).toBe('Malaria');
      expect(trends).toHaveProperty('trend');
      expect(trends).toHaveProperty('summary');
    });
  });

  describe('HealthData.getEnvironmentalIndicators', () => {
    it('should return environmental health indicators', async () => {
      const HealthData = require('../src/models/HealthData');
      const indicators = await HealthData.getEnvironmentalIndicators();

      expect(indicators).toHaveProperty('location');
      expect(indicators).toHaveProperty('indicators');
      expect(indicators).toHaveProperty('summary');
      expect(indicators).toHaveProperty('recommendations');
      expect(Array.isArray(indicators.recommendations)).toBe(true);
    });
  });

  describe('HealthData.getPreventiveTips', () => {
    it('should return preventive health tips', async () => {
      const HealthData = require('../src/models/HealthData');
      const tips = await HealthData.getPreventiveTips();

      expect(tips).toHaveProperty('location');
      expect(tips).toHaveProperty('risk_level');
      expect(tips).toHaveProperty('tips');
      expect(tips).toHaveProperty('context');
      expect(Array.isArray(tips.tips)).toBe(true);
    });

    it('should filter by category', async () => {
      const HealthData = require('../src/models/HealthData');
      const tips = await HealthData.getPreventiveTips(null, 'environmental');

      expect(tips.category).toBe('environmental');
    });
  });
});
