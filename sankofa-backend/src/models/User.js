const { supabase, supabaseAdmin, dbUtils } = require('../config/supabase');
const logger = require('../utils/logger');

class User {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.role = data.role;
    this.isEmailVerified = data.is_email_verified || false;
    this.isPhoneVerified = data.is_phone_verified || false;
    this.profile = data.profile || {};
    this.location = data.location || {};
    this.healthTokens = data.health_tokens || 0;
    this.savingsTokens = data.savings_tokens || 0;
    this.totalEarnings = data.total_earnings || 0;
    this.totalCollections = data.total_collections || 0;
    this.totalWeight = data.total_weight || 0;
    this.status = data.status || 'active';
    this.lastLoginAt = data.last_login_at;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;

    // Low-tech/illiterate collector support fields
    this.cardNumber = data.card_number;
    this.hasPhone = data.has_phone;
    this.emergencyContact = data.emergency_contact;
    this.landmark = data.landmark;
    this.preferredLanguage = data.preferred_language || 'english';
    this.canRead = data.can_read;
    this.physicalIdNumber = data.physical_id_number;
    this.collectorNotes = data.collector_notes;
    this.registeredBy = data.registered_by;
    this.registrationDate = data.registration_date;
    this.neighborhood = data.neighborhood;
  }

  // Create a new user
  static async create(userData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([{
          id: dbUtils.generateId(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password, // Should be hashed before calling this
          role: userData.role,
          is_email_verified: false,
          is_phone_verified: false,
          profile: userData.profile || {},
          location: userData.location || {},
          health_tokens: 0,
          total_earnings: 0,
          total_collections: 0,
          total_weight: 0,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      logger.info('User created successfully:', { userId: data.id, email: data.email });
      return new User(data);
    } catch (error) {
      logger.error('Error creating user:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return new User(data);
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return new User(data);
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Find user by phone
  static async findByPhone(phone) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return new User(data);
    } catch (error) {
      logger.error('Error finding user by phone:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Get all users with pagination and filters
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      const { from, to } = dbUtils.paginate(page, limit);
      
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

      // Apply filters
      query = dbUtils.buildFilters(filters);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        users: data.map(user => new User(user)),
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('Error finding users:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Update user
  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;

      // Update current instance
      Object.assign(this, new User(data));
      
      logger.info('User updated successfully:', { userId: this.id });
      return this;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Delete user
  async delete() {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', this.id);

      if (error) throw error;

      logger.info('User deleted successfully:', { userId: this.id });
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Update last login
  async updateLastLogin() {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id);

      if (error) throw error;

      this.lastLoginAt = new Date().toISOString();
      return this;
    } catch (error) {
      logger.error('Error updating last login:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Verify email
  async verifyEmail() {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id);

      if (error) throw error;

      this.isEmailVerified = true;
      logger.info('Email verified for user:', { userId: this.id });
      return this;
    } catch (error) {
      logger.error('Error verifying email:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Verify phone
  async verifyPhone() {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_phone_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id);

      if (error) throw error;

      this.isPhoneVerified = true;
      logger.info('Phone verified for user:', { userId: this.id });
      return this;
    } catch (error) {
      logger.error('Error verifying phone:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Add health tokens
  async addHealthTokens(amount) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          health_tokens: this.healthTokens + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id);

      if (error) throw error;

      this.healthTokens += amount;
      logger.info('Health tokens added:', { userId: this.id, amount, newTotal: this.healthTokens });
      return this;
    } catch (error) {
      logger.error('Error adding health tokens:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Update collection stats
  async updateCollectionStats(weight, earnings) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          total_collections: this.totalCollections + 1,
          total_weight: this.totalWeight + weight,
          total_earnings: this.totalEarnings + earnings,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id);

      if (error) throw error;

      this.totalCollections += 1;
      this.totalWeight += weight;
      this.totalEarnings += earnings;
      
      logger.info('Collection stats updated:', { 
        userId: this.id, 
        weight, 
        earnings,
        newTotalCollections: this.totalCollections,
        newTotalWeight: this.totalWeight,
        newTotalEarnings: this.totalEarnings
      });
      
      return this;
    } catch (error) {
      logger.error('Error updating collection stats:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Get user statistics
  static async getStats() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, status, created_at');

      if (error) throw error;

      const stats = {
        total: data.length,
        byRole: {},
        byStatus: {},
        recent: 0
      };

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      data.forEach(user => {
        // Count by role
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
        
        // Count by status
        stats.byStatus[user.status] = (stats.byStatus[user.status] || 0) + 1;
        
        // Count recent users
        if (new Date(user.created_at) > thirtyDaysAgo) {
          stats.recent++;
        }
      });

      return stats;
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Get top users by collections
  static async getTopUsers(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, total_collections, total_weight, total_earnings, health_tokens')
        .order('total_collections', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(user => new User(user));
    } catch (error) {
      logger.error('Error getting top users:', error);
      throw dbUtils.handleError(error);
    }
  }

  // Convert to JSON (exclude sensitive data)
  toJSON() {
    const user = { ...this };
    delete user.password;
    return user;
  }

  // Convert to public profile
  toPublicProfile() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      totalCollections: this.totalCollections,
      totalWeight: this.totalWeight,
      totalEarnings: this.totalEarnings,
      healthTokens: this.healthTokens,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;