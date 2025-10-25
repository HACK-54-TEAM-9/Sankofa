const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class SupabaseUser {
  static async create(userData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findByPhone(phone) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      logger.error('Error finding user by phone:', error);
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = supabaseAdmin.from('users').select('*');

      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error finding users:', error);
      throw error;
    }
  }

  toPublicProfile() {
    const profile = { ...this };
    delete profile.password;
    delete profile.emailVerificationToken;
    delete profile.phoneVerificationCode;
    delete profile.passwordResetToken;
    delete profile.passwordResetExpires;
    return profile;
  }
}

module.exports = SupabaseUser;
