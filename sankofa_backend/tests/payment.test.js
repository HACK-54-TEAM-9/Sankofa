const request = require('supertest');
const app = require('../src/server');

describe('Payment Gateway Tests', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'collector@example.com',
        password: 'collectorpassword123'
      });

    if (loginRes.status === 200) {
      authToken = loginRes.body.token;
      testUserId = loginRes.body.user.id;
    }
  });

  describe('POST /api/payments/initialize', () => {
    it('should initialize payment with required fields', async () => {
      const res = await request(app)
        .post('/api/payments/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 100,
          currency: 'GHS',
          email: 'collector@example.com',
          metadata: {
            purpose: 'collection_payment',
            collection_id: 'test-collection-123'
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('authorization_url');
      expect(res.body.data).toHaveProperty('access_code');
      expect(res.body.data).toHaveProperty('reference');
    });

    it('should reject invalid amount', async () => {
      const res = await request(app)
        .post('/api/payments/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: -50,
          currency: 'GHS',
          email: 'test@example.com'
        });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/payments/initialize')
        .send({
          amount: 100,
          currency: 'GHS',
          email: 'test@example.com'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/payments/mobile-money', () => {
    it('should process mobile money payment', async () => {
      const res = await request(app)
        .post('/api/payments/mobile-money')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50,
          currency: 'GHS',
          phone: '+233244123456',
          provider: 'mtn',
          email: 'collector@example.com',
          metadata: {
            purpose: 'health_token_purchase'
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('reference');
      expect(res.body.data).toHaveProperty('status');
    });

    it('should validate phone number format', async () => {
      const res = await request(app)
        .post('/api/payments/mobile-money')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50,
          currency: 'GHS',
          phone: 'invalid-phone',
          provider: 'mtn',
          email: 'test@example.com'
        });

      expect(res.status).toBe(400);
    });

    it('should support multiple providers', async () => {
      const providers = ['mtn', 'vodafone', 'airtel-tigo'];
      
      for (const provider of providers) {
        const res = await request(app)
          .post('/api/payments/mobile-money')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            amount: 20,
            currency: 'GHS',
            phone: '+233244123456',
            provider,
            email: 'test@example.com'
          });

        expect(res.status).toBe(200);
      }
    });
  });

  describe('POST /api/payments/bank-transfer', () => {
    it('should process bank transfer', async () => {
      const res = await request(app)
        .post('/api/payments/bank-transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 200,
          currency: 'GHS',
          email: 'collector@example.com',
          metadata: {
            purpose: 'donation'
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('account_number');
      expect(res.body.data).toHaveProperty('bank_name');
      expect(res.body.data).toHaveProperty('reference');
    });
  });

  describe('POST /api/payments/card', () => {
    it('should process card payment', async () => {
      const res = await request(app)
        .post('/api/payments/card')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 150,
          currency: 'GHS',
          email: 'collector@example.com',
          card: {
            number: '4084084084084081',
            cvv: '123',
            expiry_month: '12',
            expiry_year: '25'
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should validate card details', async () => {
      const res = await request(app)
        .post('/api/payments/card')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 150,
          currency: 'GHS',
          email: 'test@example.com',
          card: {
            number: '1234', // Invalid
            cvv: '123',
            expiry_month: '12',
            expiry_year: '25'
          }
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/payments/:reference/verify', () => {
    it('should verify payment status', async () => {
      // First initialize a payment
      const initRes = await request(app)
        .post('/api/payments/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 100,
          currency: 'GHS',
          email: 'collector@example.com'
        });

      const reference = initRes.body.data.reference;

      const verifyRes = await request(app)
        .get(`/api/payments/${reference}/verify`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.data).toHaveProperty('status');
      expect(verifyRes.body.data).toHaveProperty('amount');
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('should handle charge.success webhook', async () => {
      const webhookData = {
        event: 'charge.success',
        data: {
          reference: 'test-ref-123',
          amount: 10000, // 100.00 GHS in kobo
          currency: 'GHS',
          status: 'success',
          customer: {
            email: 'test@example.com'
          },
          metadata: {
            user_id: testUserId,
            purpose: 'collection_payment'
          }
        }
      };

      const res = await request(app)
        .post('/api/payments/webhook')
        .send(webhookData);

      expect(res.status).toBe(200);
    });

    it('should handle charge.failed webhook', async () => {
      const webhookData = {
        event: 'charge.failed',
        data: {
          reference: 'test-ref-456',
          amount: 5000,
          currency: 'GHS',
          status: 'failed',
          customer: {
            email: 'test@example.com'
          }
        }
      };

      const res = await request(app)
        .post('/api/payments/webhook')
        .send(webhookData);

      expect(res.status).toBe(200);
    });

    it('should handle refund.processed webhook', async () => {
      const webhookData = {
        event: 'refund.processed',
        data: {
          reference: 'test-ref-789',
          amount: 3000,
          currency: 'GHS',
          status: 'refunded',
          refund_reason: 'Customer request'
        }
      };

      const res = await request(app)
        .post('/api/payments/webhook')
        .send(webhookData);

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/payments/history', () => {
    it('should return payment history for user', async () => {
      const res = await request(app)
        .get('/api/payments/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.payments)).toBe(true);
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/payments/history')
        .query({ status: 'completed' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.payments.every(p => p.status === 'completed')).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/payments/history')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.payments.length).toBeLessThanOrEqual(10);
    });
  });
});
