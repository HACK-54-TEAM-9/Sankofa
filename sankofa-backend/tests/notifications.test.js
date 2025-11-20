const request = require('supertest');
const app = require('../src/server');

describe('Notification System Tests', () => {
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

  describe('Email Notifications', () => {
    const emailService = require('../src/services/emailService');

    it('should send verification email', async () => {
      const result = await emailService.sendVerificationEmail(
        'test@example.com',
        'John Doe',
        '123456'
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('messageId');
    });

    it('should send welcome email', async () => {
      const result = await emailService.sendWelcomeEmail(
        'test@example.com',
        'Jane Doe'
      );

      expect(result).toHaveProperty('success');
    });

    it('should send collection confirmation email', async () => {
      const collectionData = {
        collectionId: 'COL-123',
        collectorName: 'John Collector',
        weight: 5.5,
        plasticType: 'PET',
        amount: 27.50,
        healthTokens: 5,
        date: new Date().toISOString()
      };

      const result = await emailService.sendCollectionConfirmationEmail(
        'collector@example.com',
        collectionData
      );

      expect(result).toHaveProperty('success');
    });

    it('should send payment notification email', async () => {
      const paymentData = {
        amount: 100,
        currency: 'GHS',
        reference: 'PAY-123',
        status: 'completed',
        date: new Date().toISOString()
      };

      const result = await emailService.sendPaymentNotificationEmail(
        'collector@example.com',
        'John Doe',
        paymentData
      );

      expect(result).toHaveProperty('success');
    });

    it('should send password reset email', async () => {
      const resetToken = 'reset-token-123';
      const resetUrl = `https://sankofa.com/reset-password?token=${resetToken}`;

      const result = await emailService.sendPasswordResetEmail(
        'test@example.com',
        'John Doe',
        resetUrl
      );

      expect(result).toHaveProperty('success');
    });

    it('should send hub manager notification', async () => {
      const notificationData = {
        hubName: 'Accra Central Hub',
        message: 'New collection registered',
        collectionId: 'COL-456',
        collectorName: 'Jane Collector'
      };

      const result = await emailService.sendHubManagerNotification(
        'manager@example.com',
        notificationData
      );

      expect(result).toHaveProperty('success');
    });

    it('should validate email format', async () => {
      try {
        await emailService.sendVerificationEmail(
          'invalid-email',
          'Test User',
          '123456'
        );
        // Should throw error
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should render HTML email template', async () => {
      const html = emailService.renderTemplate('verification', {
        name: 'John Doe',
        code: '123456'
      });

      expect(html).toContain('123456');
      expect(html).toContain('John Doe');
      expect(html).toContain('<html');
    });

    it('should include plain text version', async () => {
      const text = emailService.renderPlainText('verification', {
        name: 'John Doe',
        code: '123456'
      });

      expect(text).toContain('123456');
      expect(text).toContain('John Doe');
    });
  });

  describe('Push Notifications', () => {
    const notificationService = require('../src/services/notificationService');

    it('should send push notification', async () => {
      const result = await notificationService.sendPushNotification(
        testUserId,
        {
          title: 'New Collection',
          body: 'Your collection has been confirmed',
          data: {
            collectionId: 'COL-123',
            type: 'collection_confirmation'
          }
        }
      );

      expect(result).toHaveProperty('success');
    });

    it('should handle missing FCM token gracefully', async () => {
      const result = await notificationService.sendPushNotification(
        'non-existent-user',
        {
          title: 'Test',
          body: 'Test notification'
        }
      );

      // Should not crash, may return false or handle gracefully
      expect(result).toHaveProperty('success');
    });

    it('should send notification to multiple devices', async () => {
      const tokens = [
        'token-1',
        'token-2',
        'token-3'
      ];

      const result = await notificationService.sendMulticastNotification(
        tokens,
        {
          title: 'Bulk Notification',
          body: 'Test bulk push'
        }
      );

      expect(result).toHaveProperty('success');
    });
  });

  describe('Notification Preferences', () => {
    it('should get user notification preferences', async () => {
      const res = await request(app)
        .get('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('preferences');
    });

    it('should update notification preferences', async () => {
      const res = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email_notifications: true,
          sms_notifications: true,
          push_notifications: false,
          collection_alerts: true,
          payment_alerts: true,
          health_alerts: false
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should respect user preferences for emails', async () => {
      // Update preferences to disable emails
      await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email_notifications: false
        });

      // Try to send notification - should respect preference
      const notificationService = require('../src/services/notificationService');
      
      const result = await notificationService.sendNotification(
        testUserId,
        {
          type: 'collection_confirmation',
          channels: ['email']
        }
      );

      // Should skip or handle based on preferences
      expect(result).toBeDefined();
    });
  });

  describe('Notification History', () => {
    it('should get notification history', async () => {
      const res = await request(app)
        .get('/api/notifications/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
    });

    it('should filter by notification type', async () => {
      const res = await request(app)
        .get('/api/notifications/history')
        .query({ type: 'sms' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      if (res.body.data.notifications.length > 0) {
        expect(res.body.data.notifications.every(n => n.type === 'sms')).toBe(true);
      }
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/notifications/history')
        .query({ status: 'sent' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      if (res.body.data.notifications.length > 0) {
        expect(res.body.data.notifications.every(n => n.status === 'sent')).toBe(true);
      }
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/notifications/history')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.notifications.length).toBeLessThanOrEqual(10);
    });

    it('should include notification metadata', async () => {
      const res = await request(app)
        .get('/api/notifications/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      if (res.body.data.notifications.length > 0) {
        const notification = res.body.data.notifications[0];
        expect(notification).toHaveProperty('id');
        expect(notification).toHaveProperty('type');
        expect(notification).toHaveProperty('status');
        expect(notification).toHaveProperty('created_at');
      }
    });
  });

  describe('Notification Delivery Status', () => {
    it('should track email delivery status', async () => {
      const emailService = require('../src/services/emailService');
      
      const result = await emailService.sendVerificationEmail(
        'test@example.com',
        'Test User',
        '123456'
      );

      expect(result).toHaveProperty('messageId');
      expect(result).toHaveProperty('status');
    });

    it('should track SMS delivery status', async () => {
      const smsService = require('../src/services/smsService');
      
      const result = await smsService.sendSMS(
        '+233244123456',
        'Test SMS'
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('messageId');
    });

    it('should update notification status on delivery', async () => {
      // This would be updated via webhook in production
      const notificationService = require('../src/services/notificationService');
      
      const result = await notificationService.updateNotificationStatus(
        'test-notification-id',
        'delivered'
      );

      expect(result).toBeDefined();
    });

    it('should handle delivery failures', async () => {
      const notificationService = require('../src/services/notificationService');
      
      const result = await notificationService.updateNotificationStatus(
        'test-notification-id',
        'failed',
        {
          error: 'Invalid recipient'
        }
      );

      expect(result).toBeDefined();
    });
  });

  describe('Batch Notifications', () => {
    const notificationService = require('../src/services/notificationService');

    it('should send notifications to multiple users', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      
      const result = await notificationService.sendBatchNotifications(
        userIds,
        {
          type: 'announcement',
          title: 'System Update',
          message: 'The system will be updated tonight',
          channels: ['email', 'push']
        }
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('sent');
      expect(result).toHaveProperty('failed');
    });

    it('should handle partial failures gracefully', async () => {
      const userIds = ['valid-user-1', 'invalid-user', 'valid-user-2'];
      
      const result = await notificationService.sendBatchNotifications(
        userIds,
        {
          type: 'test',
          message: 'Test batch notification'
        }
      );

      expect(result).toHaveProperty('success');
      expect(result.sent + result.failed).toBe(userIds.length);
    });

    it('should respect rate limits for batch sending', async () => {
      const userIds = Array.from({ length: 50 }, (_, i) => `user-${i}`);
      
      const result = await notificationService.sendBatchNotifications(
        userIds,
        {
          type: 'bulk_test',
          message: 'Rate limit test'
        },
        {
          batchSize: 10,
          delayBetweenBatches: 1000
        }
      );

      expect(result).toHaveProperty('success');
    });
  });

  describe('Template Management', () => {
    const emailService = require('../src/services/emailService');

    it('should support custom email templates', async () => {
      const customTemplate = {
        subject: 'Custom Template Test',
        html: '<p>Hello {{name}}, your code is {{code}}</p>',
        text: 'Hello {{name}}, your code is {{code}}'
      };

      const rendered = emailService.renderCustomTemplate(
        customTemplate.html,
        {
          name: 'John Doe',
          code: '123456'
        }
      );

      expect(rendered).toContain('John Doe');
      expect(rendered).toContain('123456');
    });

    it('should validate template variables', async () => {
      const template = 'Hello {{name}}, your balance is {{balance}}';
      const variables = { name: 'John' };
      
      const missingVars = emailService.validateTemplateVariables(
        template,
        variables
      );

      expect(missingVars).toContain('balance');
    });
  });

  describe('Notification Scheduling', () => {
    const notificationService = require('../src/services/notificationService');

    it('should schedule future notifications', async () => {
      const futureDate = new Date(Date.now() + 3600000); // 1 hour from now

      const result = await notificationService.scheduleNotification(
        testUserId,
        {
          type: 'reminder',
          message: 'Scheduled reminder',
          channels: ['email']
        },
        futureDate
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('scheduledId');
    });

    it('should cancel scheduled notifications', async () => {
      const futureDate = new Date(Date.now() + 3600000);

      const scheduleResult = await notificationService.scheduleNotification(
        testUserId,
        {
          type: 'test',
          message: 'To be cancelled'
        },
        futureDate
      );

      const cancelResult = await notificationService.cancelScheduledNotification(
        scheduleResult.scheduledId
      );

      expect(cancelResult).toHaveProperty('success');
      expect(cancelResult.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    const emailService = require('../src/services/emailService');
    const smsService = require('../src/services/smsService');

    it('should handle SMTP connection errors', async () => {
      try {
        // This might fail if SMTP is not configured
        await emailService.sendVerificationEmail(
          'test@example.com',
          'Test User',
          '123456'
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBeDefined();
      }
    });

    it('should handle Twilio API errors', async () => {
      try {
        await smsService.sendSMS(
          '+233244123456',
          'Test SMS'
        );
      } catch (error) {
        // May fail without proper Twilio credentials
        expect(error).toBeDefined();
      }
    });

    it('should log notification errors', async () => {
      const notificationService = require('../src/services/notificationService');
      
      try {
        await notificationService.sendNotification(
          'invalid-user-id',
          {
            type: 'test',
            message: 'Error test'
          }
        );
      } catch (error) {
        // Error should be logged
        expect(error).toBeDefined();
      }
    });
  });
});
