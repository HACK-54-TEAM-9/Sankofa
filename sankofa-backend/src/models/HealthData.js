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

  // Get comprehensive health statistics
  static async getHealthStats() {
    try {
      // Get all health data
      const { data: allData, error: allError } = await supabaseAdmin
        .from('health_data')
        .select('*');

      if (allError) throw allError;

      // Get recent data (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recentData, error: recentError } = await supabaseAdmin
        .from('health_data')
        .select('*')
        .gte('created_at', thirtyDaysAgo);

      if (recentError) throw recentError;

      // Calculate statistics
      const activeData = allData.filter(d => d.status === 'active');
      
      // Group by source
      const bySource = allData.reduce((acc, item) => {
        acc[item.source] = (acc[item.source] || 0) + 1;
        return acc;
      }, {});

      // Calculate average risk level
      const riskLevels = allData
        .map(d => d.health_metrics?.riskAssessment?.overallRisk)
        .filter(Boolean);
      
      const riskCounts = {
        low: riskLevels.filter(r => r === 'low').length,
        medium: riskLevels.filter(r => r === 'medium').length,
        high: riskLevels.filter(r => r === 'high').length,
        critical: riskLevels.filter(r => r === 'critical').length
      };

      // Collect all diseases
      const allDiseases = {};
      allData.forEach(item => {
        const diseases = item.health_metrics?.diseases || [];
        diseases.forEach(disease => {
          allDiseases[disease] = (allDiseases[disease] || 0) + 1;
        });
      });

      // Get top 10 diseases
      const topDiseases = Object.entries(allDiseases)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([disease, count]) => ({ disease, occurrences: count }));

      // Location breakdown
      const locationStats = {};
      allData.forEach(item => {
        const loc = item.location?.city || item.location?.region || 'Unknown';
        if (!locationStats[loc]) {
          locationStats[loc] = { total: 0, high_risk: 0 };
        }
        locationStats[loc].total++;
        if (['high', 'critical'].includes(item.health_metrics?.riskAssessment?.overallRisk)) {
          locationStats[loc].high_risk++;
        }
      });

      // Recent trends (comparing to previous 30 days)
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
      const { data: previousData, error: prevError } = await supabaseAdmin
        .from('health_data')
        .select('*')
        .gte('created_at', sixtyDaysAgo)
        .lt('created_at', thirtyDaysAgo);

      if (prevError) throw prevError;

      const trendComparison = {
        current_period: recentData.length,
        previous_period: previousData.length,
        change: recentData.length - previousData.length,
        change_percentage: previousData.length > 0 
          ? ((recentData.length - previousData.length) / previousData.length * 100).toFixed(1) + '%'
          : 'N/A'
      };

      // Data quality metrics
      const qualityScores = allData
        .map(d => d.data_quality?.confidence)
        .filter(Boolean);
      const avgQuality = qualityScores.length > 0
        ? (qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length).toFixed(2)
        : 0;

      return {
        overview: {
          total: allData.length,
          active: activeData.length,
          recent_submissions: recentData.length
        },
        bySource,
        riskDistribution: {
          ...riskCounts,
          total: riskLevels.length
        },
        diseases: {
          unique_diseases: Object.keys(allDiseases).length,
          total_occurrences: Object.values(allDiseases).reduce((a, b) => a + b, 0),
          top_diseases: topDiseases
        },
        locations: {
          total_locations: Object.keys(locationStats).length,
          breakdown: locationStats
        },
        trends: trendComparison,
        data_quality: {
          average_confidence: parseFloat(avgQuality),
          records_with_quality_score: qualityScores.length
        }
      };
    } catch (error) {
      logger.error('Error getting health stats:', error);
      return { 
        overview: { total: 0, active: 0, recent_submissions: 0 },
        bySource: {},
        riskDistribution: { low: 0, medium: 0, high: 0, critical: 0, total: 0 },
        diseases: { unique_diseases: 0, total_occurrences: 0, top_diseases: [] },
        locations: { total_locations: 0, breakdown: {} },
        trends: { current_period: 0, previous_period: 0, change: 0, change_percentage: 'N/A' },
        data_quality: { average_confidence: 0, records_with_quality_score: 0 }
      };
    }
  }

  // Get comprehensive disease trends with time-series analysis
  static async getDiseaseTrends(disease, region) {
    try {
      // Get data from last 180 days for better trend analysis
      const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();
      
      let query = supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', sixMonthsAgo)
        .order('created_at', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      // Filter by region if specified
      let filteredData = data;
      if (region) {
        filteredData = data.filter(item => 
          item.location?.region?.toLowerCase() === region.toLowerCase() ||
          item.location?.city?.toLowerCase() === region.toLowerCase()
        );
      }

      // Group by week
      const weeklyData = {};
      filteredData.forEach(item => {
        const date = new Date(item.created_at);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            date: weekKey,
            diseases: {},
            total_cases: 0,
            risk_levels: { low: 0, medium: 0, high: 0, critical: 0 }
          };
        }

        // Count diseases
        const diseases = item.health_metrics?.diseases || [];
        diseases.forEach(d => {
          weeklyData[weekKey].diseases[d] = (weeklyData[weekKey].diseases[d] || 0) + 1;
          weeklyData[weekKey].total_cases++;
        });

        // Track risk levels
        const risk = item.health_metrics?.riskAssessment?.overallRisk;
        if (risk && weeklyData[weekKey].risk_levels[risk] !== undefined) {
          weeklyData[weekKey].risk_levels[risk]++;
        }
      });

      // Convert to array and sort by date
      const trends = Object.values(weeklyData).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      // If specific disease requested, extract that disease's data
      if (disease) {
        const diseaseTrend = trends.map(week => ({
          date: week.date,
          cases: week.diseases[disease] || 0,
          percentage: week.total_cases > 0 
            ? ((week.diseases[disease] || 0) / week.total_cases * 100).toFixed(1) + '%'
            : '0%'
        }));

        // Calculate growth rate
        const recentWeeks = diseaseTrend.slice(-4);
        const olderWeeks = diseaseTrend.slice(-8, -4);
        
        const recentAvg = recentWeeks.length > 0
          ? recentWeeks.reduce((sum, w) => sum + w.cases, 0) / recentWeeks.length
          : 0;
        const olderAvg = olderWeeks.length > 0
          ? olderWeeks.reduce((sum, w) => sum + w.cases, 0) / olderWeeks.length
          : 0;
        
        const growthRate = olderAvg > 0
          ? ((recentAvg - olderAvg) / olderAvg * 100).toFixed(1)
          : 0;

        return {
          disease,
          region: region || 'All regions',
          trend: diseaseTrend,
          summary: {
            total_cases: diseaseTrend.reduce((sum, w) => sum + w.cases, 0),
            peak_week: diseaseTrend.reduce((max, w) => w.cases > max.cases ? w : max, diseaseTrend[0]),
            growth_rate: parseFloat(growthRate),
            trend_direction: growthRate > 10 ? 'increasing' : growthRate < -10 ? 'decreasing' : 'stable'
          }
        };
      }

      // Return all diseases trends
      const allDiseases = {};
      trends.forEach(week => {
        Object.entries(week.diseases).forEach(([diseaseName, count]) => {
          if (!allDiseases[diseaseName]) {
            allDiseases[diseaseName] = { name: diseaseName, weekly_data: [], total: 0 };
          }
          allDiseases[diseaseName].weekly_data.push({ date: week.date, cases: count });
          allDiseases[diseaseName].total += count;
        });
      });

      // Sort by total cases
      const sortedDiseases = Object.values(allDiseases)
        .sort((a, b) => b.total - a.total)
        .slice(0, 15); // Top 15 diseases

      return {
        region: region || 'All regions',
        time_range: '180 days',
        weekly_overview: trends,
        top_diseases: sortedDiseases,
        summary: {
          total_weeks: trends.length,
          total_cases: trends.reduce((sum, w) => sum + w.total_cases, 0),
          unique_diseases: Object.keys(allDiseases).length,
          average_cases_per_week: trends.length > 0 
            ? (trends.reduce((sum, w) => sum + w.total_cases, 0) / trends.length).toFixed(1)
            : 0
        }
      };
    } catch (error) {
      logger.error('Error getting disease trends:', error);
      return {
        region: region || 'All regions',
        time_range: '180 days',
        weekly_overview: [],
        top_diseases: [],
        summary: {
          total_weeks: 0,
          total_cases: 0,
          unique_diseases: 0,
          average_cases_per_week: 0
        }
      };
    }
  }

  // Get comprehensive environmental health indicators
  static async getEnvironmentalIndicators(location) {
    try {
      // Get recent data (last 90 days)
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      
      let query = supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', ninetyDaysAgo)
        .order('created_at', { ascending: false });

      if (location) {
        // Filter by location in application code since JSONB filtering can be complex
        const { data: allData, error } = await query;
        if (error) throw error;

        const data = allData.filter(item => 
          item.location?.city?.toLowerCase().includes(location.toLowerCase()) ||
          item.location?.region?.toLowerCase().includes(location.toLowerCase()) ||
          item.location?.district?.toLowerCase().includes(location.toLowerCase())
        );

        return this.processEnvironmentalData(data, location);
      } else {
        const { data, error } = await query;
        if (error) throw error;
        return this.processEnvironmentalData(data, 'All locations');
      }
    } catch (error) {
      logger.error('Error getting environmental indicators:', error);
      return {
        location: location || 'All locations',
        indicators: [],
        summary: {},
        recommendations: []
      };
    }
  }

  // Helper method to process environmental data
  static processEnvironmentalData(data, location) {
    if (!data || data.length === 0) {
      return {
        location,
        indicators: [],
        summary: {
          total_assessments: 0,
          average_air_quality: 0,
          average_water_quality: 0,
          plastic_pollution_level: 0
        },
        recommendations: ['Insufficient data available for analysis']
      };
    }

    // Extract environmental metrics
    const indicators = data.map(item => {
      const envHealth = item.health_metrics?.environmentalHealth || {};
      const collectionImpact = item.collection_impact || {};

      return {
        date: item.created_at.split('T')[0],
        location: item.location,
        air_quality: envHealth.airQuality || 0,
        water_quality: envHealth.waterQuality || 0,
        plastic_pollution: envHealth.plasticPollution || 0,
        sanitation_index: envHealth.sanitationIndex || 0,
        waste_management_score: collectionImpact.wasteReductionScore || 0,
        risk_level: item.health_metrics?.riskAssessment?.overallRisk || 'unknown',
        source: item.source
      };
    });

    // Calculate averages
    const avgAirQuality = indicators.length > 0
      ? (indicators.reduce((sum, i) => sum + (i.air_quality || 0), 0) / indicators.length).toFixed(2)
      : 0;
    
    const avgWaterQuality = indicators.length > 0
      ? (indicators.reduce((sum, i) => sum + (i.water_quality || 0), 0) / indicators.length).toFixed(2)
      : 0;
    
    const avgPlasticPollution = indicators.length > 0
      ? (indicators.reduce((sum, i) => sum + (i.plastic_pollution || 0), 0) / indicators.length).toFixed(2)
      : 0;
    
    const avgSanitation = indicators.length > 0
      ? (indicators.reduce((sum, i) => sum + (i.sanitation_index || 0), 0) / indicators.length).toFixed(2)
      : 0;

    const avgWasteManagement = indicators.length > 0
      ? (indicators.reduce((sum, i) => sum + (i.waste_management_score || 0), 0) / indicators.length).toFixed(2)
      : 0;

    // Trend analysis (comparing first half vs second half of period)
    const midPoint = Math.floor(indicators.length / 2);
    const recentHalf = indicators.slice(0, midPoint);
    const olderHalf = indicators.slice(midPoint);

    const recentAvgPollution = recentHalf.length > 0
      ? recentHalf.reduce((sum, i) => sum + (i.plastic_pollution || 0), 0) / recentHalf.length
      : 0;
    
    const olderAvgPollution = olderHalf.length > 0
      ? olderHalf.reduce((sum, i) => sum + (i.plastic_pollution || 0), 0) / olderHalf.length
      : 0;

    const pollutionTrend = olderAvgPollution > 0
      ? ((recentAvgPollution - olderAvgPollution) / olderAvgPollution * 100).toFixed(1)
      : 0;

    // Generate recommendations
    const recommendations = [];
    
    if (parseFloat(avgPlasticPollution) > 70) {
      recommendations.push('Critical: High plastic pollution detected - increase collection efforts immediately');
      recommendations.push('Deploy additional collectors to high-risk areas');
    } else if (parseFloat(avgPlasticPollution) > 50) {
      recommendations.push('Moderate plastic pollution - maintain regular collection schedules');
    } else {
      recommendations.push('Plastic pollution levels are manageable - continue current efforts');
    }

    if (parseFloat(avgAirQuality) < 50) {
      recommendations.push('Poor air quality detected - avoid outdoor activities during peak hours');
    }

    if (parseFloat(avgWaterQuality) < 50) {
      recommendations.push('Water quality concerns - use treated or bottled water');
    }

    if (parseFloat(avgSanitation) < 60) {
      recommendations.push('Sanitation improvements needed - focus on waste management infrastructure');
    }

    if (pollutionTrend > 10) {
      recommendations.push('Warning: Plastic pollution is increasing - scale up interventions');
    } else if (pollutionTrend < -10) {
      recommendations.push('Positive trend: Plastic pollution is decreasing - efforts are working!');
    }

    // Calculate correlation with health risks
    const highRiskCount = indicators.filter(i => ['high', 'critical'].includes(i.risk_level)).length;
    const highRiskPercentage = ((highRiskCount / indicators.length) * 100).toFixed(1);

    return {
      location,
      indicators: indicators.slice(0, 50), // Limit to most recent 50
      summary: {
        total_assessments: indicators.length,
        average_air_quality: parseFloat(avgAirQuality),
        average_water_quality: parseFloat(avgWaterQuality),
        average_plastic_pollution: parseFloat(avgPlasticPollution),
        average_sanitation_index: parseFloat(avgSanitation),
        average_waste_management: parseFloat(avgWasteManagement),
        pollution_trend: `${pollutionTrend}%`,
        high_risk_percentage: `${highRiskPercentage}%`
      },
      trends: {
        pollution_direction: pollutionTrend > 5 ? 'increasing' : pollutionTrend < -5 ? 'decreasing' : 'stable',
        recent_period_avg: parseFloat(recentAvgPollution.toFixed(2)),
        older_period_avg: parseFloat(olderAvgPollution.toFixed(2))
      },
      recommendations
    };
  }

  // Get intelligent preventive health tips based on real data
  static async getPreventiveTips(location, category) {
    try {
      // Get recent health data (last 60 days)
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
      
      let query = supabaseAdmin
        .from('health_data')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', sixtyDaysAgo)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Filter by location if specified
      let filteredData = data;
      if (location) {
        filteredData = data.filter(item => 
          item.location?.city?.toLowerCase().includes(location.toLowerCase()) ||
          item.location?.region?.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (filteredData.length === 0) {
        return this.getDefaultPreventiveTips(category);
      }

      // Extract AI recommendations from data
      const aiRecommendations = filteredData
        .flatMap(item => item.ai_analysis?.recommendations || [])
        .filter(Boolean);

      // Analyze top diseases in the area
      const diseaseFrequency = {};
      filteredData.forEach(item => {
        (item.health_metrics?.diseases || []).forEach(disease => {
          diseaseFrequency[disease] = (diseaseFrequency[disease] || 0) + 1;
        });
      });

      const topDiseases = Object.entries(diseaseFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([disease, count]) => ({ disease, occurrences: count }));

      // Analyze environmental factors
      const avgPlasticPollution = filteredData.length > 0
        ? filteredData.reduce((sum, item) => 
            sum + (item.health_metrics?.environmentalHealth?.plasticPollution || 0), 0
          ) / filteredData.length
        : 0;

      const avgAirQuality = filteredData.length > 0
        ? filteredData.reduce((sum, item) => 
            sum + (item.health_metrics?.environmentalHealth?.airQuality || 0), 0
          ) / filteredData.length
        : 0;

      // Calculate average risk level
      const riskLevels = filteredData.map(d => d.health_metrics?.riskAssessment?.overallRisk).filter(Boolean);
      const highRiskCount = riskLevels.filter(r => ['high', 'critical'].includes(r)).length;
      const riskPercentage = riskLevels.length > 0 ? (highRiskCount / riskLevels.length) * 100 : 0;

      // Generate comprehensive tips
      const tips = [];

      // Category-specific tips
      if (!category || category === 'general') {
        tips.push({
          category: 'General Health',
          priority: 'high',
          tips: [
            'Wash hands frequently with soap and clean water',
            'Maintain physical distancing in crowded areas',
            'Wear face masks when air quality is poor',
            'Stay hydrated - drink at least 8 glasses of water daily',
            'Get adequate sleep (7-9 hours) to boost immunity'
          ]
        });
      }

      if (!category || category === 'disease_prevention') {
        const diseaseTips = {
          category: 'Disease Prevention',
          priority: riskPercentage > 50 ? 'critical' : 'medium',
          tips: []
        };

        if (topDiseases.length > 0) {
          diseaseTips.tips.push(`Alert: ${topDiseases[0].disease} cases detected in your area - take precautions`);
          
          // Disease-specific prevention
          topDiseases.forEach(({ disease }) => {
            const diseaseLower = disease.toLowerCase();
            if (diseaseLower.includes('malaria')) {
              diseaseTips.tips.push('Use mosquito nets and insect repellent');
              diseaseTips.tips.push('Eliminate standing water around your home');
            } else if (diseaseLower.includes('cholera') || diseaseLower.includes('diarrhea')) {
              diseaseTips.tips.push('Drink only treated or boiled water');
              diseaseTips.tips.push('Practice proper food hygiene');
            } else if (diseaseLower.includes('respiratory') || diseaseLower.includes('asthma')) {
              diseaseTips.tips.push('Avoid areas with heavy air pollution');
              diseaseTips.tips.push('Keep inhalers accessible if prescribed');
            } else if (diseaseLower.includes('skin')) {
              diseaseTips.tips.push('Maintain good personal hygiene');
              diseaseTips.tips.push('Avoid contact with contaminated surfaces');
            }
          });
        }

        if (diseaseTips.tips.length > 0) {
          tips.push(diseaseTips);
        }
      }

      if (!category || category === 'environmental') {
        const envTips = {
          category: 'Environmental Health',
          priority: avgPlasticPollution > 70 ? 'critical' : 'medium',
          tips: []
        };

        if (avgPlasticPollution > 60) {
          envTips.tips.push('High plastic pollution detected - avoid littering');
          envTips.tips.push('Participate in community cleanup activities');
          envTips.tips.push('Properly dispose of plastic waste at collection hubs');
        }

        if (avgAirQuality < 50) {
          envTips.tips.push('Poor air quality - limit outdoor exercise');
          envTips.tips.push('Close windows during peak pollution hours');
          envTips.tips.push('Consider wearing N95 masks outdoors');
        }

        envTips.tips.push('Support local plastic collection efforts');
        envTips.tips.push('Use reusable bags and containers to reduce plastic waste');

        tips.push(envTips);
      }

      if (!category || category === 'nutrition') {
        tips.push({
          category: 'Nutrition & Wellness',
          priority: 'medium',
          tips: [
            'Eat a balanced diet rich in fruits and vegetables',
            'Avoid street food from unhygienic sources',
            'Wash fresh produce thoroughly before consumption',
            'Limit processed foods and sugary drinks',
            'Include local nutritious foods like kontomire, okra, and fish'
          ]
        });
      }

      if (!category || category === 'safety') {
        tips.push({
          category: 'Safety Practices',
          priority: 'high',
          tips: [
            'Wear protective gear when handling waste materials',
            'Avoid direct contact with contaminated water',
            'Keep first aid supplies readily available',
            'Report any unusual health symptoms immediately',
            'Follow local health authority guidelines'
          ]
        });
      }

      // Add AI-generated recommendations if available
      if (aiRecommendations.length > 0) {
        const uniqueAITips = [...new Set(aiRecommendations.slice(0, 10))];
        if (uniqueAITips.length > 0) {
          tips.push({
            category: 'AI-Generated Recommendations',
            priority: 'medium',
            tips: uniqueAITips,
            source: 'ai_analysis'
          });
        }
      }

      return {
        location: location || 'All locations',
        category: category || 'all',
        risk_level: riskPercentage > 70 ? 'high' : riskPercentage > 40 ? 'medium' : 'low',
        tips,
        context: {
          data_points: filteredData.length,
          top_diseases: topDiseases.slice(0, 3),
          environmental_factors: {
            plastic_pollution_level: parseFloat(avgPlasticPollution.toFixed(1)),
            air_quality_level: parseFloat(avgAirQuality.toFixed(1))
          },
          high_risk_percentage: parseFloat(riskPercentage.toFixed(1))
        },
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting preventive tips:', error);
      return this.getDefaultPreventiveTips(category);
    }
  }

  // Default preventive tips when no data is available
  static getDefaultPreventiveTips(category) {
    const defaultTips = [
      {
        category: 'General Health',
        priority: 'high',
        tips: [
          'Practice good hand hygiene regularly',
          'Maintain social distancing in public spaces',
          'Stay hydrated and eat nutritious meals',
          'Get adequate rest and exercise',
          'Seek medical attention for persistent symptoms'
        ]
      },
      {
        category: 'Environmental Protection',
        priority: 'medium',
        tips: [
          'Properly dispose of plastic waste',
          'Participate in community cleanup efforts',
          'Use eco-friendly alternatives to plastic',
          'Support local recycling initiatives',
          'Educate others about environmental health'
        ]
      }
    ];

    return {
      location: 'All locations',
      category: category || 'all',
      risk_level: 'unknown',
      tips: category ? defaultTips.filter(t => 
        t.category.toLowerCase().includes(category.toLowerCase())
      ) : defaultTips,
      context: {
        data_points: 0,
        message: 'Using default tips - insufficient local data available'
      },
      last_updated: new Date().toISOString()
    };
  }

  // Instance method to convert to JSON
  toJSON() {
    return { ...this };
  }
}

module.exports = HealthData;
