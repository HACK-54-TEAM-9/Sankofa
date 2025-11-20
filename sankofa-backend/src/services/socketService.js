const logger = require('../utils/logger');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(io) {
    this.io = io;
    this.setupEventHandlers();
    logger.info('Socket.IO service initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', (data) => {
        if (data.userId) {
          this.connectedUsers.set(socket.id, {
            userId: data.userId,
            role: data.role,
            socket: socket
          });
          socket.join(`user_${data.userId}`);
          socket.join(`role_${data.role}`);
          logger.info(`User ${data.userId} authenticated via socket`);
        }
      });

      // Handle collection updates
      socket.on('collection_update', (data) => {
        this.broadcastCollectionUpdate(data);
      });

      // Handle health alerts
      socket.on('health_alert', (data) => {
        this.broadcastHealthAlert(data);
      });

      // Handle hub notifications
      socket.on('hub_notification', (data) => {
        this.broadcastHubNotification(data);
      });

      // Handle AI interaction updates
      socket.on('ai_interaction', (data) => {
        this.broadcastAIInteraction(data);
      });

      // Handle donation updates
      socket.on('donation_update', (data) => {
        this.broadcastDonationUpdate(data);
      });

      // Handle user disconnection
      socket.on('disconnect', () => {
        const userInfo = this.connectedUsers.get(socket.id);
        if (userInfo) {
          logger.info(`User ${userInfo.userId} disconnected`);
          this.connectedUsers.delete(socket.id);
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error('Socket error:', error);
      });
    });
  }

  // Broadcast collection update to relevant users
  broadcastCollectionUpdate(data) {
    const { collectorId, hubId, weight, amount, status } = data;
    
    // Notify the collector
    this.io.to(`user_${collectorId}`).emit('collection_updated', {
      type: 'collection_update',
      data: { weight, amount, status },
      timestamp: new Date().toISOString()
    });

    // Notify hub manager
    this.io.to(`hub_${hubId}`).emit('collection_updated', {
      type: 'collection_update',
      data: { collectorId, weight, amount, status },
      timestamp: new Date().toISOString()
    });

    // Notify admins
    this.io.to('role_admin').emit('collection_updated', {
      type: 'collection_update',
      data: { collectorId, hubId, weight, amount, status },
      timestamp: new Date().toISOString()
    });

    logger.info('Collection update broadcasted', { collectorId, hubId, weight, amount });
  }

  // Broadcast health alert to users in affected area
  broadcastHealthAlert(data) {
    const { location, riskLevel, message, affectedUsers } = data;
    
    // Notify users in the affected area
    if (affectedUsers && affectedUsers.length > 0) {
      affectedUsers.forEach(userId => {
        this.io.to(`user_${userId}`).emit('health_alert', {
          type: 'health_alert',
          data: { location, riskLevel, message },
          timestamp: new Date().toISOString()
        });
      });
    }

    // Notify health managers and admins
    this.io.to('role_hub-manager').emit('health_alert', {
      type: 'health_alert',
      data: { location, riskLevel, message },
      timestamp: new Date().toISOString()
    });

    this.io.to('role_admin').emit('health_alert', {
      type: 'health_alert',
      data: { location, riskLevel, message },
      timestamp: new Date().toISOString()
    });

    logger.info('Health alert broadcasted', { location, riskLevel });
  }

  // Broadcast hub notification
  broadcastHubNotification(data) {
    const { hubId, message, type, affectedUsers } = data;
    
    // Notify users associated with the hub
    if (affectedUsers && affectedUsers.length > 0) {
      affectedUsers.forEach(userId => {
        this.io.to(`user_${userId}`).emit('hub_notification', {
          type: 'hub_notification',
          data: { hubId, message, notificationType: type },
          timestamp: new Date().toISOString()
        });
      });
    }

    // Notify hub managers
    this.io.to(`hub_${hubId}`).emit('hub_notification', {
      type: 'hub_notification',
      data: { hubId, message, notificationType: type },
      timestamp: new Date().toISOString()
    });

    logger.info('Hub notification broadcasted', { hubId, type });
  }

  // Broadcast AI interaction update
  broadcastAIInteraction(data) {
    const { userId, interactionType, insights } = data;
    
    // Notify the user about AI insights
    this.io.to(`user_${userId}`).emit('ai_insights', {
      type: 'ai_insights',
      data: { interactionType, insights },
      timestamp: new Date().toISOString()
    });

    logger.info('AI interaction broadcasted', { userId, interactionType });
  }

  // Broadcast donation update
  broadcastDonationUpdate(data) {
    const { donorId, amount, impact } = data;
    
    // Notify the donor
    this.io.to(`user_${donorId}`).emit('donation_update', {
      type: 'donation_update',
      data: { amount, impact },
      timestamp: new Date().toISOString()
    });

    // Notify admins about large donations
    if (amount >= 1000) {
      this.io.to('role_admin').emit('donation_update', {
        type: 'large_donation',
        data: { donorId, amount, impact },
        timestamp: new Date().toISOString()
      });
    }

    logger.info('Donation update broadcasted', { donorId, amount });
  }

  // Send notification to specific user
  sendToUser(userId, event, data) {
    this.io.to(`user_${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
    logger.info('Notification sent to user', { userId, event });
  }

  // Send notification to users by role
  sendToRole(role, event, data) {
    this.io.to(`role_${role}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
    logger.info('Notification sent to role', { role, event });
  }

  // Send notification to users in specific location
  sendToLocation(location, event, data) {
    this.io.to(`location_${location}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
    logger.info('Notification sent to location', { location, event });
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected users by role
  getConnectedUsersByRole(role) {
    const users = [];
    this.connectedUsers.forEach((userInfo, socketId) => {
      if (userInfo.role === role) {
        users.push({
          socketId,
          userId: userInfo.userId,
          role: userInfo.role
        });
      }
    });
    return users;
  }

  // Broadcast system-wide announcement
  broadcastAnnouncement(message, type = 'info') {
    this.io.emit('system_announcement', {
      type: 'system_announcement',
      data: { message, announcementType: type },
      timestamp: new Date().toISOString()
    });
    logger.info('System announcement broadcasted', { message, type });
  }

  // Broadcast maintenance notification
  broadcastMaintenanceNotification(duration, message) {
    this.io.emit('maintenance_notification', {
      type: 'maintenance_notification',
      data: { duration, message },
      timestamp: new Date().toISOString()
    });
    logger.info('Maintenance notification broadcasted', { duration });
  }

  // Handle real-time analytics updates
  broadcastAnalyticsUpdate(analyticsData) {
    this.io.to('role_admin').emit('analytics_update', {
      type: 'analytics_update',
      data: analyticsData,
      timestamp: new Date().toISOString()
    });
  }

  // Handle payment status updates
  broadcastPaymentUpdate(paymentData) {
    const { userId, status, amount, transactionId } = paymentData;
    
    this.io.to(`user_${userId}`).emit('payment_update', {
      type: 'payment_update',
      data: { status, amount, transactionId },
      timestamp: new Date().toISOString()
    });

    logger.info('Payment update broadcasted', { userId, status, amount });
  }
}

// Create singleton instance
const socketService = new SocketService();

module.exports = socketService;
