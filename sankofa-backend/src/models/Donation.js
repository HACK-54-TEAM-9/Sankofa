const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Donation model using Supabase
class Donation {
  constructor(data) {
    Object.assign(this, data);
  }

  // Create new donation
  static async create(donationData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .insert([donationData])
        .select()
        .single();

      if (error) throw error;
      return new Donation(data);
    } catch (error) {
      logger.error('Error creating donation:', error);
      throw error;
    }
  }

  // Find donation by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .select('*, donor:users!donor_id(id, name, email)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Donation(data) : null;
    } catch (error) {
      logger.error('Error finding donation:', error);
      return null;
    }
  }

  // Find all donations with filters
  static async find(filter = {}, options = {}) {
    try {
      let query = supabaseAdmin
        .from('donations')
        .select('*, donor:users!donor_id(id, name, email)', { count: 'exact' });

      // Apply filters
      if (filter.donor_id) query = query.eq('donor_id', filter.donor_id);
      if (filter.type) query = query.eq('type', filter.type);
      if (filter.status) query = query.eq('status', filter.status);

      // Apply sorting
      const sortField = options.sort || 'created_at';
      const sortOrder = options.order || 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (options.limit) query = query.limit(options.limit);

      const { data, error, count } = await query;

      if (error) throw error;
      return {
        donations: data.map(item => new Donation(item)),
        total: count
      };
    } catch (error) {
      logger.error('Error finding donations:', error);
      throw error;
    }
  }

  // Update donation
  static async findByIdAndUpdate(id, updateData, options = {}) {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Donation(data) : null;
    } catch (error) {
      logger.error('Error updating donation:', error);
      throw error;
    }
  }

  // Delete donation
  static async findByIdAndDelete(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Donation(data) : null;
    } catch (error) {
      logger.error('Error deleting donation:', error);
      throw error;
    }
  }

  // Get donation statistics
  static async getStats() {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .select('*');

      if (error) throw error;

      const stats = {
        total: data.length,
        totalAmount: data.reduce((sum, don) => sum + parseFloat(don.amount || 0), 0),
        byType: data.reduce((acc, don) => {
          acc[don.type] = (acc[don.type] || 0) + 1;
          return acc;
        }, {}),
        byStatus: data.reduce((acc, don) => {
          const status = don.payment?.status || don.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {}),
        recurring: data.filter(d => d.type !== 'one-time').length
      };

      return stats;
    } catch (error) {
      logger.error('Error getting donation stats:', error);
      throw error;
    }
  }

  // Instance method to convert to JSON
  toJSON() {
    return { ...this };
  }
}

module.exports = Donation;
