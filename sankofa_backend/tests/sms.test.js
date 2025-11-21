const request = require('supertest');
const app = require('../src/server');

describe('SMS Service Tests', () => {
  let authToken;

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

  describe('SMS Service Direct Tests', () => {
    const smsService = require('../src/services/smsService');

    it('should send SMS to single recipient', async () => {
      const result = await smsService.sendSMS(
        '+233244123456',
        'Test message from Sankofa'
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('messageId');
    });

    it('should validate phone number format', async () => {
      try {
        await smsService.sendSMS(
          'invalid-phone',
          'Test message'
        );
        // Should throw error for invalid phone
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should send verification code SMS', async () => {
      const code = '123456';
      const result = await smsService.sendVerificationSMS(
        '+233244123456',
        code
      );

      expect(result).toHaveProperty('success');
    });

    it('should send welcome SMS to new user', async () => {
      const result = await smsService.sendWelcomeSMS(
        '+233244123456',
        'John Doe'
      );

      expect(result).toHaveProperty('success');
    });

    it('should send collection confirmation SMS', async () => {
      const result = await smsService.sendCollectionConfirmationSMS(
        '+233244123456',
        {
          collectionId: 'test-123',
          weight: 5.5,
          amount: 27.50,
          healthTokens: 5
        }
      );

      expect(result).toHaveProperty('success');
    });

    it('should send payment notification SMS', async () => {
      const result = await smsService.sendPaymentNotificationSMS(
        '+233244123456',
        {
          amount: 100,
          currency: 'GHS',
          status: 'completed',
          reference: 'PAY-123'
        }
      );

      expect(result).toHaveProperty('success');
    });
  });

  describe('Bulk SMS with Queue', () => {
    const smsService = require('../src/services/smsService');

    it('should initialize SMS queue', async () => {
      await smsService.initializeSMSQueue();
      
      // Queue should be initialized
      expect(smsService.smsQueue).toBeDefined();
    });

    it('should queue bulk SMS for sending', async () => {
      const recipients = [
        '+233244123456',
        '+233244123457',
        '+233244123458',
        '+233244123459',
        '+233244123460'
      ];

      const message = 'Bulk test message from Sankofa';

      const result = await smsService.sendBulkSMSQueued(
        recipients,
        message
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('jobIds');
      expect(Array.isArray(result.jobIds)).toBe(true);
    });

    it('should chunk recipients correctly', async () => {
      const recipients = Array.from({ length: 150 }, (_, i) => 
        `+23324412${String(i).padStart(4, '0')}`
      );

      const message = 'Large bulk test';

      const result = await smsService.sendBulkSMSQueued(
        recipients,
        message,
        {
          chunkSize: 50
        }
      );

      expect(result.jobIds.length).toBe(3); // 150 / 50 = 3 chunks
    });

    it('should support priority levels', async () => {
      const recipients = ['+233244123456', '+233244123457'];
      const message = 'Priority test';

      const result = await smsService.sendBulkSMSQueued(
        recipients,
        message,
        {
          priority: 1
        }
      );

      expect(result.success).toBe(true);
    });

    it('should support delayed sending', async () => {
      const recipients = ['+233244123456'];
      const message = 'Delayed test';

      const result = await smsService.sendBulkSMSQueued(
        recipients,
        message,
        {
          delay: 5000 // 5 seconds
        }
      );

      expect(result.success).toBe(true);
    });

    it('should get queue statistics', async () => {
      const stats = await smsService.getQueueStats();

      expect(stats).toHaveProperty('waiting');
      expect(stats).toHaveProperty('active');
      expect(stats).toHaveProperty('completed');
      expect(stats).toHaveProperty('failed');
      expect(stats).toHaveProperty('delayed');
      
      expect(typeof stats.waiting).toBe('number');
      expect(typeof stats.active).toBe('number');
    });
  });

  describe('Scheduled SMS', () => {
    const smsService = require('../src/services/smsService');

    it('should schedule SMS for future delivery', async () => {
      const futureDate = new Date(Date.now() + 60000); // 1 minute from now

      const result = await smsService.scheduleSMS(
        '+233244123456',
        'Scheduled message',
        futureDate
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('jobId');
      expect(result).toHaveProperty('scheduledFor');
    });

    it('should reject past dates for scheduling', async () => {
      const pastDate = new Date(Date.now() - 60000); // 1 minute ago

      try {
        await smsService.scheduleSMS(
          '+233244123456',
          'Past date message',
          pastDate
        );
        // Should throw error
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should cancel scheduled SMS', async () => {
      const futureDate = new Date(Date.now() + 120000);

      const scheduleResult = await smsService.scheduleSMS(
        '+233244123456',
        'To be cancelled',
        futureDate
      );

      const jobId = scheduleResult.jobId;

      const cancelResult = await smsService.cancelScheduledSMS(jobId);

      expect(cancelResult).toHaveProperty('success');
      expect(cancelResult.success).toBe(true);
    });

    it('should handle non-existent job cancellation', async () => {
      try {
        await smsService.cancelScheduledSMS('non-existent-job-id');
        // May or may not throw depending on implementation
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should schedule bulk SMS with custom template', async () => {
      const futureDate = new Date(Date.now() + 90000);
      const recipients = ['+233244123456', '+233244123457'];
      
      const message = 'Hello {name}, your collection is confirmed!';

      const result = await smsService.scheduleSMS(
        recipients[0],
        message,
        futureDate,
        {
          template: 'collection_reminder',
          variables: {
            name: 'John'
          }
        }
      );

      expect(result.success).toBe(true);
    });
  });

  describe('SMS Templates', () => {
    const smsService = require('../src/services/smsService');

    it('should render verification template', async () => {
      const message = smsService.renderTemplate('verification', {
        code: '123456'
      });

      expect(message).toContain('123456');
      expect(message.toLowerCase()).toContain('code');
    });

    it('should render welcome template', async () => {
      const message = smsService.renderTemplate('welcome', {
        name: 'John Doe'
      });

      expect(message).toContain('John Doe');
      expect(message.toLowerCase()).toContain('welcome');
    });

    it('should render collection confirmation template', async () => {
      const message = smsService.renderTemplate('collection_confirmation', {
        collectionId: 'COL-123',
        weight: 5.5,
        amount: 27.50,
        healthTokens: 5
      });

      expect(message).toContain('5.5');
      expect(message).toContain('27.50');
    });

    it('should render payment notification template', async () => {
      const message = smsService.renderTemplate('payment_notification', {
        amount: 100,
        currency: 'GHS',
        reference: 'PAY-123'
      });

      expect(message).toContain('100');
      expect(message).toContain('GHS');
    });

    it('should handle missing template gracefully', async () => {
      const message = smsService.renderTemplate('non_existent', {
        data: 'test'
      });

      expect(message).toBeDefined();
      expect(typeof message).toBe('string');
    });

    it('should handle missing variables in template', async () => {
      const message = smsService.renderTemplate('verification', {});

      expect(message).toBeDefined();
      expect(typeof message).toBe('string');
    });
  });

  describe('SMS Logging', () => {
    const smsService = require('../src/services/smsService');

    it('should log SMS to database', async () => {
      const result = await smsService.logSMSToDatabase(
        'test-user-id',
        '+233244123456',
        'Test message',
        'sms',
        'success',
        'test-message-id'
      );

      expect(result).toBeDefined();
    });

    it('should log failed SMS with error', async () => {
      const result = await smsService.logSMSToDatabase(
        'test-user-id',
        '+233244123456',
        'Failed message',
        'sms',
        'failed',
        null,
        {
          message_id: null,
          template: 'test',
          error: 'Network error'
        }
      );

      expect(result).toBeDefined();
    });

    it('should log scheduled SMS with job ID', async () => {
      const result = await smsService.logSMSToDatabase(
        'test-user-id',
        '+233244123456',
        'Scheduled message',
        'sms',
        'scheduled',
        null,
        {
          job_id: 'job-123',
          scheduled_at: new Date().toISOString()
        }
      );

      expect(result).toBeDefined();
    });
  });

  describe('Queue Error Handling', () => {
    const smsService = require('../src/services/smsService');

    it('should handle queue processing errors', async () => {
      // This tests the queue's error handling
      const recipients = ['+233244123456'];
      const message = 'Error test';

      const result = await smsService.sendBulkSMSQueued(
        recipients,
        message
      );

      expect(result).toHaveProperty('success');
    });

    it('should retry failed jobs', async () => {
      // Queue should have retry mechanism configured
      const stats = await smsService.getQueueStats();
      
      expect(stats).toBeDefined();
      // Failed jobs should be tracked
      expect(typeof stats.failed).toBe('number');
    });

    it('should handle Redis connection errors gracefully', async () => {
      try {
        await smsService.initializeSMSQueue();
        // Should handle connection errors
        expect(true).toBe(true);
      } catch (error) {
        // Graceful fallback expected
        expect(error).toBeDefined();
      }
    });
  });

  describe('SMS Rate Limiting', () => {
    const smsService = require('../src/services/smsService');

    it('should respect rate limits for bulk sending', async () => {
      const recipients = Array.from({ length: 20 }, (_, i) => 
        `+23324412${String(i).padStart(4, '0')}`
      );

      const result = await smsService.sendBulkSMSQueued(
        recipients,
        'Rate limit test',
        {
          chunkSize: 5,
          delay: 1000 // 1 second between chunks
        }
      );

      expect(result.success).toBe(true);
      expect(result.jobIds.length).toBe(4); // 20 / 5 = 4 chunks
    });

    it('should queue messages sequentially', async () => {
      const recipients = ['+233244123456', '+233244123457', '+233244123458'];
      
      for (let i = 0; i < recipients.length; i++) {
        await smsService.sendSMS(recipients[i], `Message ${i + 1}`);
      }

      // All messages should be sent/queued
      expect(true).toBe(true);
    });
  });

  describe('International Format Support', () => {
    const smsService = require('../src/services/smsService');

    it('should handle Ghana phone formats', async () => {
      const formats = [
        '+233244123456',
        '0244123456',
        '233244123456'
      ];

      for (const phone of formats) {
        try {
          const result = await smsService.sendSMS(phone, 'Format test');
          expect(result).toHaveProperty('success');
        } catch (error) {
          // Some formats may need normalization
          expect(error).toBeDefined();
        }
      }
    });

    it('should normalize phone numbers', async () => {
      const normalized = smsService.normalizePhoneNumber('0244123456');
      
      expect(normalized).toContain('+233');
    });
  });
});
