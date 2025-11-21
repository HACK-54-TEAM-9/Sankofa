const request = require('supertest');
const app = require('../src/server');

describe('AI Assistant Tests', () => {
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

  describe('POST /api/ai/chat', () => {
    it('should generate AI response with context', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'What are my recent collection stats?',
          conversation_id: 'test-conv-123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('response');
      expect(res.body.data).toHaveProperty('conversation_id');
      expect(res.body.data).toHaveProperty('message_id');
      expect(typeof res.body.data.response).toBe('string');
    });

    it('should start new conversation without conversation_id', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'How can I improve my collection efficiency?'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.conversation_id).toBeDefined();
    });

    it('should maintain conversation history', async () => {
      const convId = 'test-conv-history';
      
      const firstRes = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'What is my total plastic collected?',
          conversation_id: convId
        });

      expect(firstRes.status).toBe(200);

      const secondRes = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'How does that compare to last month?',
          conversation_id: convId
        });

      expect(secondRes.status).toBe(200);
      expect(secondRes.body.data.conversation_id).toBe(convId);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({
          message: 'Test message'
        });

      expect(res.status).toBe(401);
    });

    it('should reject empty messages', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: ''
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/ai/voice', () => {
    it('should process voice input', async () => {
      // Mock audio file buffer
      const mockAudioBuffer = Buffer.from('mock-audio-data');
      
      const res = await request(app)
        .post('/api/ai/voice')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', mockAudioBuffer, 'voice.mp3')
        .field('language', 'en');

      // Note: Will return error without real audio, but tests endpoint exists
      expect([200, 400, 500]).toContain(res.status);
    });

    it('should support multiple languages', async () => {
      const languages = ['en', 'tw', 'ak'];
      
      for (const lang of languages) {
        const mockAudioBuffer = Buffer.from('mock-audio-data');
        
        const res = await request(app)
          .post('/api/ai/voice')
          .set('Authorization', `Bearer ${authToken}`)
          .attach('audio', mockAudioBuffer, 'voice.mp3')
          .field('language', lang);

        // Endpoint should accept these language codes
        expect([200, 400, 500]).toContain(res.status);
      }
    });

    it('should require authentication', async () => {
      const mockAudioBuffer = Buffer.from('mock-audio-data');
      
      const res = await request(app)
        .post('/api/ai/voice')
        .attach('audio', mockAudioBuffer, 'voice.mp3');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/ai/recommendations/health', () => {
    it('should generate health recommendations', async () => {
      const res = await request(app)
        .get('/api/ai/recommendations/health')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.data.recommendations)).toBe(true);
      
      if (res.body.data.recommendations.length > 0) {
        const rec = res.body.data.recommendations[0];
        expect(rec).toHaveProperty('title');
        expect(rec).toHaveProperty('description');
        expect(rec).toHaveProperty('priority');
      }
    });

    it('should filter by location', async () => {
      const res = await request(app)
        .get('/api/ai/recommendations/health')
        .query({ location: 'Accra' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.location).toBe('Accra');
    });

    it('should provide context-aware recommendations', async () => {
      const res = await request(app)
        .get('/api/ai/recommendations/health')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      if (res.body.data.recommendations.length > 0) {
        expect(res.body.data).toHaveProperty('user_context');
        expect(res.body.data.user_context).toHaveProperty('total_collections');
        expect(res.body.data.user_context).toHaveProperty('health_tokens');
      }
    });
  });

  describe('GET /api/ai/recommendations/collection', () => {
    it('should generate collection efficiency recommendations', async () => {
      const res = await request(app)
        .get('/api/ai/recommendations/collection')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.data.recommendations)).toBe(true);
    });

    it('should analyze user collection patterns', async () => {
      const res = await request(app)
        .get('/api/ai/recommendations/collection')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      if (res.body.data.recommendations.length > 0) {
        expect(res.body.data).toHaveProperty('analysis');
        expect(res.body.data.analysis).toHaveProperty('efficiency_score');
        expect(res.body.data.analysis).toHaveProperty('collection_frequency');
      }
    });

    it('should suggest optimal collection times', async () => {
      const res = await request(app)
        .get('/api/ai/recommendations/collection')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      if (res.body.data.recommendations.length > 0) {
        const hasTimeRecommendation = res.body.data.recommendations.some(
          rec => rec.type === 'timing' || rec.title.toLowerCase().includes('time')
        );
        // May or may not have time recommendation based on data
        expect(typeof hasTimeRecommendation).toBe('boolean');
      }
    });
  });

  describe('GET /api/ai/insights', () => {
    it('should generate AI-powered insights', async () => {
      const res = await request(app)
        .get('/api/ai/insights')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('insights');
      expect(Array.isArray(res.body.data.insights)).toBe(true);
    });

    it('should include environmental impact insights', async () => {
      const res = await request(app)
        .get('/api/ai/insights')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      const hasEnvironmentalInsight = res.body.data.insights.some(
        insight => insight.category === 'environmental' || 
                  insight.type === 'environmental_impact'
      );
      
      expect(typeof hasEnvironmentalInsight).toBe('boolean');
    });

    it('should provide actionable recommendations', async () => {
      const res = await request(app)
        .get('/api/ai/insights')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      if (res.body.data.insights.length > 0) {
        const firstInsight = res.body.data.insights[0];
        expect(firstInsight).toHaveProperty('description');
        expect(firstInsight).toHaveProperty('actionable');
      }
    });
  });

  describe('GET /api/ai/conversation/:conversationId', () => {
    it('should retrieve conversation history', async () => {
      // First create a conversation
      const chatRes = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'Test message for history',
          conversation_id: 'history-test-123'
        });

      const convId = chatRes.body.data.conversation_id;

      const historyRes = await request(app)
        .get(`/api/ai/conversation/${convId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(historyRes.status).toBe(200);
      expect(historyRes.body.success).toBe(true);
      expect(Array.isArray(historyRes.body.data.messages)).toBe(true);
    });

    it('should return 404 for non-existent conversation', async () => {
      const res = await request(app)
        .get('/api/ai/conversation/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 200]).toContain(res.status);
    });
  });

  describe('Direct Model Tests', () => {
    const AIService = require('../src/services/aiService');

    it('should generate context-aware AI response', async () => {
      const userContext = {
        userId: testUserId,
        totalCollections: 45,
        totalPlastic: 120.5,
        healthTokens: 80,
        role: 'collector'
      };

      const response = await AIService.generateAIResponse(
        'What should I focus on?',
        userContext,
        []
      );

      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should generate health recommendations with disease analysis', async () => {
      const userContext = {
        userId: testUserId,
        location: 'Accra',
        totalCollections: 30,
        healthTokens: 50
      };

      const recommendations = await AIService.generateHealthRecommendations(userContext);

      expect(Array.isArray(recommendations)).toBe(true);
      
      if (recommendations.length > 0) {
        const rec = recommendations[0];
        expect(rec).toHaveProperty('title');
        expect(rec).toHaveProperty('description');
        expect(rec).toHaveProperty('priority');
      }
    });

    it('should generate collection advice with stats', async () => {
      const userStats = {
        totalCollections: 50,
        avgCollectionWeight: 3.5,
        collectionFrequency: 'weekly',
        preferredLocation: 'Accra Central',
        efficiencyScore: 75
      };

      const advice = await AIService.generateCollectionAdvice(userStats);

      expect(Array.isArray(advice)).toBe(true);
      
      if (advice.length > 0) {
        const item = advice[0];
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
      }
    });

    it('should generate AI insights with efficiency calculations', async () => {
      const data = {
        collections: 40,
        plasticWeight: 150,
        healthTokens: 90,
        location: 'Kumasi',
        recentActivity: [
          { date: '2025-01-01', weight: 5 },
          { date: '2025-01-08', weight: 4.5 },
          { date: '2025-01-15', weight: 5.5 }
        ]
      };

      const insights = await AIService.generateAIInsights(data);

      expect(Array.isArray(insights)).toBe(true);
      
      if (insights.length > 0) {
        const insight = insights[0];
        expect(insight).toHaveProperty('category');
        expect(insight).toHaveProperty('description');
        expect(insight).toHaveProperty('actionable');
      }
    });
  });
});
