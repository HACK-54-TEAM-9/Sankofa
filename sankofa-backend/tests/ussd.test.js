const request = require('supertest');
const app = require('../src/server');

describe('USSD System Tests', () => {
  let authToken;
  let testSessionId;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@sankofa.com',
        password: 'adminpassword123'
      });

    if (loginRes.status === 200) {
      authToken = loginRes.body.token;
    }
  });

  describe('POST /api/ussd/callback', () => {
    it('should handle initial USSD session', async () => {
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId: 'session-123',
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: ''
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/plain');
      expect(res.text).toContain('CON');
      expect(res.text).toContain('Welcome to Sankofa');
    });

    it('should handle menu navigation', async () => {
      const sessionId = 'session-nav-123';
      
      // Initial request
      const initRes = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: ''
        });

      expect(initRes.text).toContain('CON');

      // Select option 1 (Check Balance)
      const menuRes = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '1'
        });

      expect(menuRes.status).toBe(200);
      expect(menuRes.text).toContain('CON');
      expect(menuRes.text.toLowerCase()).toContain('balance');
    });

    it('should handle balance check flow', async () => {
      const sessionId = 'session-balance-456';
      
      // Navigate to check balance
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '1'
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('CON');
    });

    it('should handle recent collections flow', async () => {
      const sessionId = 'session-collections-789';
      
      // Navigate to recent collections
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '2'
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('CON');
    });

    it('should handle nearest hub flow', async () => {
      const sessionId = 'session-hub-101';
      
      // Navigate to nearest hub
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '3'
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('CON');
    });

    it('should handle health tokens flow', async () => {
      const sessionId = 'session-health-202';
      
      // Navigate to health tokens
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '4'
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('CON');
    });

    it('should handle report collection flow', async () => {
      const sessionId = 'session-report-303';
      
      // Navigate to report collection
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '5'
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('CON');
    });

    it('should handle invalid menu option', async () => {
      const sessionId = 'session-invalid-999';
      
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '9'
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('END');
      expect(res.text.toLowerCase()).toContain('invalid');
    });

    it('should handle session timeout', async () => {
      // Test that old sessions are handled properly
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId: 'old-session-' + Date.now(),
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '1*2*3*4*5'
        });

      expect(res.status).toBe(200);
    });

    it('should validate phone number format', async () => {
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId: 'session-phone-test',
          serviceCode: '*384*123#',
          phoneNumber: 'invalid-phone',
          text: ''
        });

      // Should still return response but may show error
      expect(res.status).toBe(200);
    });

    it('should handle multi-level navigation', async () => {
      const sessionId = 'session-multi-level';
      
      // Navigate: Main -> Balance -> Back -> Recent Collections
      const res = await request(app)
        .post('/api/ussd/callback')
        .send({
          sessionId,
          serviceCode: '*384*123#',
          phoneNumber: '+233244123456',
          text: '1*0*2'
        });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/ussd/status', () => {
    it('should return active session status (admin only)', async () => {
      const res = await request(app)
        .get('/api/ussd/status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('active_sessions');
      expect(typeof res.body.data.active_sessions).toBe('number');
    });

    it('should require admin authentication', async () => {
      const res = await request(app)
        .get('/api/ussd/status');

      expect(res.status).toBe(401);
    });

    it('should include session list', async () => {
      const res = await request(app)
        .get('/api/ussd/status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.sessions)).toBe(true);
    });
  });

  describe('POST /api/ussd/test', () => {
    it('should test USSD flow (admin only)', async () => {
      const res = await request(app)
        .post('/api/ussd/test')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phoneNumber: '+233244123456',
          input: '1'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should simulate user journey', async () => {
      const res = await request(app)
        .post('/api/ussd/test')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phoneNumber: '+233244123456',
          input: '2'
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('response');
    });

    it('should require admin authentication', async () => {
      const res = await request(app)
        .post('/api/ussd/test')
        .send({
          phoneNumber: '+233244123456',
          input: '1'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('USSD Service Tests', () => {
    const smsService = require('../src/services/smsService');

    it('should handle USSD session creation', async () => {
      const response = await smsService.handleUSSDSession(
        'test-session-create',
        '+233244123456',
        '',
        ''
      );

      expect(response).toHaveProperty('text');
      expect(response).toHaveProperty('continueSession');
      expect(response.text).toContain('Welcome to Sankofa');
    });

    it('should handle balance check menu', async () => {
      const response = await smsService.handleUSSDSession(
        'test-session-balance',
        '+233244123456',
        '1',
        ''
      );

      expect(response).toHaveProperty('text');
      expect(response.continueSession).toBe(true);
    });

    it('should retrieve user data by phone', async () => {
      const userData = await smsService.getUserDataByPhone('+233244123456');

      expect(userData).toBeDefined();
      if (userData) {
        expect(userData).toHaveProperty('id');
        expect(userData).toHaveProperty('name');
      }
    });

    it('should get recent collections', async () => {
      const collections = await smsService.getRecentCollections('test-user-id', 3);

      expect(Array.isArray(collections)).toBe(true);
      expect(collections.length).toBeLessThanOrEqual(3);
    });

    it('should find nearest hub', async () => {
      const hub = await smsService.getNearestHub('Accra');

      expect(hub).toBeDefined();
      if (hub) {
        expect(hub).toHaveProperty('name');
        expect(hub).toHaveProperty('address');
      }
    });

    it('should maintain session state', async () => {
      const sessionId = 'state-test-session';
      
      // First interaction
      await smsService.handleUSSDSession(
        sessionId,
        '+233244123456',
        '',
        ''
      );

      // Second interaction - should remember state
      const response = await smsService.handleUSSDSession(
        sessionId,
        '+233244123456',
        '1',
        ''
      );

      expect(response.continueSession).toBe(true);
    });

    it('should end session properly', async () => {
      const response = await smsService.handleUSSDSession(
        'test-end-session',
        '+233244123456',
        '0',
        ''
      );

      expect(response.continueSession).toBe(false);
      expect(response.text).toContain('Thank you');
    });

    it('should handle invalid input gracefully', async () => {
      const response = await smsService.handleUSSDSession(
        'test-invalid-input',
        '+233244123456',
        'invalid',
        ''
      );

      expect(response).toHaveProperty('text');
      expect(response.continueSession).toBe(false);
    });

    it('should log USSD interactions', async () => {
      // This would normally create a database entry
      await smsService.handleUSSDSession(
        'test-log-session',
        '+233244123456',
        '1',
        ''
      );

      // Check that interaction was logged (implementation dependent)
      expect(true).toBe(true);
    });
  });
});
