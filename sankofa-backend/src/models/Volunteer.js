const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Volunteer model using Supabase
class Volunteer {
  constructor(data) {
    Object.assign(this, data);
  }

  // Create new volunteer
  static async create(volunteerData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('volunteers')
        .insert([volunteerData])
        .select()
        .single();

      if (error) throw error;
      return new Volunteer(data);
    } catch (error) {
      logger.error('Error creating volunteer:', error);
      throw error;
    }
  }

  // Find volunteer by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('volunteers')
        .select('*, user:users!user_id(id, name, email, phone)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Volunteer(data) : null;
    } catch (error) {
      logger.error('Error finding volunteer:', error);
      return null;
    }
  }

  // Find all volunteers with filters
  static async find(filter = {}, options = {}) {
    try {
      let query = supabaseAdmin
        .from('volunteers')
        .select('*, user:users!user_id(id, name, email, phone)', { count: 'exact' });

      // Apply filters
      if (filter.user_id) query = query.eq('user_id', filter.user_id);
      if (filter.status) query = query.eq('status', filter.status);
      if (filter.opportunity_id) query = query.eq('opportunity_id', filter.opportunity_id);

      // Apply sorting
      const sortField = options.sort || 'created_at';
      const sortOrder = options.order || 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (options.limit) query = query.limit(options.limit);

      const { data, error, count } = await query;

      if (error) throw error;
      return {
        volunteers: data.map(item => new Volunteer(item)),
        total: count
      };
    } catch (error) {
      logger.error('Error finding volunteers:', error);
      throw error;
    }
  }

  // Update volunteer
  static async findByIdAndUpdate(id, updateData, options = {}) {
    try {
      const { data, error } = await supabaseAdmin
        .from('volunteers')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Volunteer(data) : null;
    } catch (error) {
      logger.error('Error updating volunteer:', error);
      throw error;
    }
  }

  // Delete volunteer
  static async findByIdAndDelete(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('volunteers')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Volunteer(data) : null;
    } catch (error) {
      logger.error('Error deleting volunteer:', error);
      throw error;
    }
  }

  // Get volunteer opportunities (static data)
  static getVolunteerOpportunities() {
    return [
      {
        id: 'opp_1',
        title: 'Community Outreach',
        description: 'Help educate communities about plastic pollution and health risks',
        category: 'Education',
        timeCommitment: 'Flexible',
        skills: ['Communication', 'Public Speaking']
      },
      {
        id: 'opp_2',
        title: 'Collection Support',
        description: 'Assist at collection hubs and help manage operations',
        category: 'Operations',
        timeCommitment: '4-8 hours/week',
        skills: ['Organization', 'Physical Work']
      },
      {
        id: 'opp_3',
        title: 'Health Education',
        description: 'Conduct health workshops and awareness programs',
        category: 'Health',
        timeCommitment: '2-4 hours/week',
        skills: ['Teaching', 'Health Knowledge']
      },
      {
        id: 'opp_4',
        title: 'Data Collection',
        description: 'Help gather and analyze environmental health data',
        category: 'Research',
        timeCommitment: 'Flexible',
        skills: ['Data Entry', 'Analysis']
      }
    ];
  }

  // Get volunteer statistics
  static async getStats() {
    try {
      const { data, error } = await supabaseAdmin
        .from('volunteers')
        .select('*');

      if (error) throw error;

      const stats = {
        total: data.length,
        byStatus: data.reduce((acc, vol) => {
          acc[vol.status] = (acc[vol.status] || 0) + 1;
          return acc;
        }, {}),
        totalHours: data.reduce((sum, vol) => sum + (vol.hours_volunteered || 0), 0),
        active: data.filter(v => v.status === 'active').length
      };

      return stats;
    } catch (error) {
      logger.error('Error getting volunteer stats:', error);
      throw error;
    }
  }

  // Instance method to convert to JSON
  toJSON() {
    return { ...this };
  }
}

module.exports = Volunteer;
