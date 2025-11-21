const request = require('supertest');
const app = require('../src/server');

describe('Donation Impact Tests', () => {
  let authToken;
  let testDonationId;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'donor@example.com',
        password: 'donorpassword123'
      });

    if (loginRes.status === 200) {
      authToken = loginRes.body.token;
    }
  });

  describe('GET /api/donations/impact/aggregate', () => {
    it('should return aggregate impact (public endpoint)', async () => {
      const res = await request(app)
        .get('/api/donations/impact/aggregate');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.impact).toHaveProperty('summary');
      expect(res.body.data.impact).toHaveProperty('environmental_impact');
      expect(res.body.data.impact).toHaveProperty('social_impact');
      expect(res.body.data.impact).toHaveProperty('donation_breakdown');
    });

    it('should filter by time range', async () => {
      const res = await request(app)
        .get('/api/donations/impact/aggregate')
        .query({ timeRange: '30d' });

      expect(res.status).toBe(200);
      expect(res.body.data.impact.summary.time_range).toBe('30d');
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/donations/impact/aggregate')
        .query({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.data.impact.summary.status_filter).toBe('completed');
    });

    it('should include environmental equivalents', async () => {
      const res = await request(app)
        .get('/api/donations/impact/aggregate');

      expect(res.status).toBe(200);
      const { environmental_impact } = res.body.data.impact;
      expect(environmental_impact).toHaveProperty('estimated');
      expect(environmental_impact).toHaveProperty('equivalents');
      expect(environmental_impact.equivalents).toHaveProperty('trees_planted_equivalent');
      expect(environmental_impact.equivalents).toHaveProperty('cars_off_road_days');
    });

    it('should include monthly trends', async () => {
      const res = await request(app)
        .get('/api/donations/impact/aggregate')
        .query({ timeRange: '90d' });

      expect(res.status).toBe(200);
      const { donation_breakdown } = res.body.data.impact;
      expect(donation_breakdown).toHaveProperty('monthly_trend');
      expect(Array.isArray(donation_breakdown.monthly_trend)).toBe(true);
    });
  });

  describe('Donation Model Tests', () => {
    it('should generate impact report for individual donation', async () => {
      const Donation = require('../src/models/Donation');
      
      // Mock donation
      const mockDonation = {
        id: 'test-donation-id',
        amount: 100,
        currency: 'GHS',
        type: 'one-time',
        status: 'completed',
        created_at: new Date().toISOString()
      };

      const report = await Donation.generateImpactReport(mockDonation);

      expect(report).toHaveProperty('donation_details');
      expect(report).toHaveProperty('environmental_impact');
      expect(report).toHaveProperty('social_impact');
      expect(report).toHaveProperty('efficiency_metrics');
      expect(report).toHaveProperty('comparison');
      expect(report).toHaveProperty('summary');
      expect(Array.isArray(report.summary)).toBe(true);
    });

    it('should calculate plastic equivalent correctly', async () => {
      const Donation = require('../src/models/Donation');
      
      const mockDonation = {
        id: 'test-id',
        amount: 100,
        currency: 'GHS',
        type: 'one-time',
        status: 'completed',
        created_at: new Date().toISOString()
      };

      const report = await Donation.generateImpactReport(mockDonation);
      const plasticKg = report.environmental_impact.estimated.plastic_collected_kg;
      
      // 100 GHS * 0.5 = 50kg
      expect(plasticKg).toBe(50);
    });

    it('should calculate CO2 savings correctly', async () => {
      const Donation = require('../src/models/Donation');
      
      const mockDonation = {
        id: 'test-id',
        amount: 100,
        currency: 'GHS',
        type: 'one-time',
        status: 'completed',
        created_at: new Date().toISOString()
      };

      const report = await Donation.generateImpactReport(mockDonation);
      const co2Kg = report.environmental_impact.estimated.co2_saved_kg;
      
      // 50kg plastic * 0.2 = 10kg CO2
      expect(co2Kg).toBe(10);
    });

    it('should generate narrative summary', async () => {
      const Donation = require('../src/models/Donation');
      
      const mockDonation = {
        id: 'test-id',
        amount: 50,
        currency: 'GHS',
        type: 'monthly',
        status: 'completed',
        created_at: new Date().toISOString()
      };

      const report = await Donation.generateImpactReport(mockDonation);
      
      expect(Array.isArray(report.summary)).toBe(true);
      expect(report.summary.length).toBeGreaterThan(0);
      expect(report.summary.some(s => s.includes('recurring'))).toBe(true);
    });
  });
});
