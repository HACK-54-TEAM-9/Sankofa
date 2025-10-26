const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// HealthData model using Supabase
class HealthData {
  constructor(data) {
    Object.assign(this, data);
  }

  // Create new health data
  static async create(healthData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('health_data')
        .insert([healthData])
        .select()
        .single();

      if (error) throw error;
      return new HealthData(data);
    } catch (error) {
      logger.error('Error creating health data:', error);
      throw error;
    }
  }

  // Find health data by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new HealthData(data) : null;
    } catch (error) {
      logger.error('Error finding health data:', error);
      return null;
    }
  }

  // Find all health data with filters
  static async find(filter = {}, options = {}) {
    try {
      let query = supabaseAdmin
        .from('health_data')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filter.source) query = query.eq('source', filter.source);
      if (filter.status) query = query.eq('status', filter.status);

      // Apply sorting
      const sortField = options.sort || 'created_at';
      const sortOrder = options.order || 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (options.limit) query = query.limit(options.limit);

      const { data, error, count } = await query;

      if (error) throw error;
      return data.map(item => new HealthData(item));
    } catch (error) {
      logger.error('Error finding health data:', error);
      throw error;
    }
  }

  // Find one health data record
  static async findOne(filter) {
    try {
      let query = supabaseAdmin
        .from('health_data')
        .select('*');

      Object.keys(filter).forEach(key => {
        query = query.eq(key, filter[key]);
      });

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data ? new HealthData(data) : null;
    } catch (error) {
      logger.error('Error finding health data:', error);
      return null;
    }
  }

  // Update health data
  static async findByIdAndUpdate(id, updateData, options = {}) {
    try {
      const { data, error } = await supabaseAdmin
        .from('health_data')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new HealthData(data) : null;
    } catch (error) {
      logger.error('Error updating health data:', error);
      throw error;
    }
  }

  // Delete health data
  static async findByIdAndDelete(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('health_data')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new HealthData(data) : null;
    } catch (error) {
      logger.error('Error deleting health data:', error);
      throw error;
    }
  }

  // Get health trends - simplified version
  static async getHealthTrends(region, timeRange = '30d') {
    try {
      let query = supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('status', 'active');

      if (region) {
        query = query.contains('location', { address: { region } });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Simple aggregation
      return data.map(item => ({
        date: item.created_at,
        location: item.location,
        metrics: item.health_metrics
      }));
    } catch (error) {
      logger.error('Error getting health trends:', error);
      return [];
    }
  }

  // Get high-risk areas
  static async getHighRiskAreas(limit = 20) {
    try {
      const { data, error } = await supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Filter by high risk
      return data
        .filter(item => {
          const risk = item.health_metrics?.riskAssessment?.overallRisk;
          return risk === 'high' || risk === 'critical';
        })
        .map(item => new HealthData(item));
    } catch (error) {
      logger.error('Error getting high-risk areas:', error);
      return [];
    }
  }

  // Get health stats - placeholder
  static async getHealthStats() {
    try {
      const { data, error } = await supabaseAdmin
        .from('health_data')
        .select('*');

      if (error) throw error;

      return {
        total: data.length,
        active: data.filter(d => d.status === 'active').length,
        bySource: data.reduce((acc, item) => {
          acc[item.source] = (acc[item.source] || 0) + 1;
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error('Error getting health stats:', error);
      return { total: 0, active: 0, bySource: {} };
    }
  }

  // Get disease trends - placeholder
  static async getDiseaseTrends(disease, region) {
    try {
      let query = supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('status', 'active');

      const { data, error } = await query;

      if (error) throw error;

      // Simple filtering
      return data.map(item => ({
        date: item.created_at,
        diseases: item.health_metrics?.diseases || []
      }));
    } catch (error) {
      logger.error('Error getting disease trends:', error);
      return [];
    }
  }

  // Get environmental indicators - placeholder
  static async getEnvironmentalIndicators(location) {
    try {
      const { data, error } = await supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('status', 'active')
        .limit(10);

      if (error) throw error;

      return data.map(item => ({
        location: item.location,
        environmental: item.health_metrics?.environmentalHealth || {}
      }));
    } catch (error) {
      logger.error('Error getting environmental indicators:', error);
      return [];
    }
  }

  // Get preventive tips - placeholder
  static async getPreventiveTips(location, category) {
    try {
      const { data, error } = await supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('status', 'active')
        .limit(10);

      if (error) throw error;

      return data.flatMap(item => item.ai_analysis?.recommendations || []);
    } catch (error) {
      logger.error('Error getting preventive tips:', error);
      return [];
    }
  }

  // Instance method to convert to JSON
  toJSON() {
    return { ...this };
  }
}

module.exports = HealthData;
