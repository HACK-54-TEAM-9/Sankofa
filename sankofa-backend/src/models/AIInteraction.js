const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// AIInteraction model using Supabase
class AIInteraction {
  constructor(data) {
    Object.assign(this, data);
  }

  // Create new AI interaction
  static async create(interactionData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_interactions')
        .insert([interactionData])
        .select()
        .single();

      if (error) throw error;
      return new AIInteraction(data);
    } catch (error) {
      logger.error('Error creating AI interaction:', error);
      throw error;
    }
  }

  // Find AI interaction by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_interactions')
        .select('*, user:users!user_id(id, name, email)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new AIInteraction(data) : null;
    } catch (error) {
      logger.error('Error finding AI interaction:', error);
      return null;
    }
  }

  // Find all AI interactions with filters
  static async find(filter = {}, options = {}) {
    try {
      let query = supabaseAdmin
        .from('ai_interactions')
        .select('*, user:users!user_id(id, name, email)', { count: 'exact' });

      // Apply filters
      if (filter.user_id) query = query.eq('user_id', filter.user_id);
      if (filter.session_id) query = query.eq('session_id', filter.session_id);
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
        interactions: data.map(item => new AIInteraction(item)),
        total: count
      };
    } catch (error) {
      logger.error('Error finding AI interactions:', error);
      throw error;
    }
  }

  // Update AI interaction
  static async findByIdAndUpdate(id, updateData, options = {}) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_interactions')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new AIInteraction(data) : null;
    } catch (error) {
      logger.error('Error updating AI interaction:', error);
      throw error;
    }
  }

  // Delete AI interaction
  static async findByIdAndDelete(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_interactions')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new AIInteraction(data) : null;
    } catch (error) {
      logger.error('Error deleting AI interaction:', error);
      throw error;
    }
  }

  // Get AI interaction statistics
  static async getStats(userId) {
    try {
      let query = supabaseAdmin
        .from('ai_interactions')
        .select('*');

      if (userId) query = query.eq('user_id', userId);

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        total: data.length,
        byType: data.reduce((acc, int) => {
          acc[int.type] = (acc[int.type] || 0) + 1;
          return acc;
        }, {}),
        byStatus: data.reduce((acc, int) => {
          acc[int.status] = (acc[int.status] || 0) + 1;
          return acc;
        }, {}),
        averageProcessingTime: data.reduce((sum, int) => 
          sum + (int.processing?.processingTime || 0), 0) / (data.length || 1)
      };

      return stats;
    } catch (error) {
      logger.error('Error getting AI interaction stats:', error);
      throw error;
    }
  }

  // Instance method to convert to JSON
  toJSON() {
    return { ...this };
  }
}

module.exports = AIInteraction;
