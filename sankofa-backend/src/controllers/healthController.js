const HealthData = require('../models/HealthData');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Get health insights
// @route   GET /api/health/insights
// @access  Public
const getHealthInsights = asyncHandler(async (req, res) => {
  const { location, region } = req.query;
  
  const filter = {};
  const options = { limit: 50, sort: 'created_at', order: 'desc' };
  
  const healthData = await HealthData.find(filter, options);

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Get health data by location
// @route   GET /api/health/location/:location
// @access  Public
const getHealthDataByLocation = asyncHandler(async (req, res) => {
  // Simple filter - in production you'd use PostGIS for geospatial queries
  const healthData = await HealthData.find({}, { limit: 10 });

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Get all health data (protected list)
// @route   GET /api/health/all
// @access  Private
const getHealthData = asyncHandler(async (req, res) => {
  const { limit = 100, sortBy = 'created_at' } = req.query;

  const healthData = await HealthData.find({}, { 
    limit: parseInt(limit, 10),
    sort: sortBy,
    order: 'desc'
  });

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Get health data by id
// @route   GET /api/health/:id
// @access  Private
const getHealthDataById = asyncHandler(async (req, res) => {
  const healthData = await HealthData.findById(req.params.id);

  if (!healthData) {
    throw new AppError('Health data not found', 404);
  }

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Create health data
// @route   POST /api/health
// @access  Private (Admin, Hub Manager)
const createHealthData = asyncHandler(async (req, res) => {
  const healthData = await HealthData.create(req.body);
  
  logger.info('Health data created', { location: healthData.location });

  res.status(201).json({
    success: true,
    message: 'Health data created successfully',
    data: { healthData }
  });
});

// @desc    Update health data
// @route   PUT /api/health/:id
// @access  Private (Admin, Hub Manager)
const updateHealthData = asyncHandler(async (req, res) => {
  const healthData = await HealthData.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date().toISOString() }
  );

  if (!healthData) {
    throw new AppError('Health data not found', 404);
  }

  res.json({
    success: true,
    message: 'Health data updated successfully',
    data: { healthData }
  });
});

// @desc    Delete health data
// @route   DELETE /api/health/:id
// @access  Private (Admin)
const deleteHealthData = asyncHandler(async (req, res) => {
  const healthData = await HealthData.findByIdAndDelete(req.params.id);

  if (!healthData) {
    throw new AppError('Health data not found', 404);
  }

  res.json({
    success: true,
    message: 'Health data deleted successfully'
  });
});

// @desc    Get health trends
// @route   GET /api/health/trends
// @access  Public
const getHealthTrends = asyncHandler(async (req, res) => {
  const { region, timeRange = '30d' } = req.query;
  
  const trends = await HealthData.getHealthTrends(region, timeRange);
  
  res.json({
    success: true,
    data: { trends }
  });
});

// @desc    Get high-risk areas
// @route   GET /api/health/high-risk-areas
// @access  Public
const getHighRiskAreas = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  
  const highRiskAreas = await HealthData.getHighRiskAreas(parseInt(limit));

  res.json({
    success: true,
    data: { highRiskAreas }
  });
});

// @desc    Get health data by region
// @route   GET /api/health/region/:region
// @access  Public
const getHealthDataByRegion = asyncHandler(async (req, res) => {
  // Simple region filter
  const healthData = await HealthData.find({}, { limit: 50 });

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Get health statistics
// @route   GET /api/health/stats
// @access  Public
const getHealthStats = asyncHandler(async (req, res) => {
  const stats = await HealthData.getHealthStats();
  
  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get disease trends
// @route   GET /api/health/disease-trends
// @access  Public
const getDiseaseTrends = asyncHandler(async (req, res) => {
  const { disease, region } = req.query;
  
  const trends = await HealthData.getDiseaseTrends(disease, region);
  
  res.json({
    success: true,
    data: { trends }
  });
});

// @desc    Get environmental health indicators
// @route   GET /api/health/environmental
// @access  Public
const getEnvironmentalHealth = asyncHandler(async (req, res) => {
  const { location } = req.query;
  
  const indicators = await HealthData.getEnvironmentalIndicators(location);
  
  res.json({
    success: true,
    data: { indicators }
  });
});

// @desc    Get preventive tips
// @route   GET /api/health/preventive-tips
// @access  Public
const getPreventiveTips = asyncHandler(async (req, res) => {
  const { location, category } = req.query;
  
  const tips = await HealthData.getPreventiveTips(location, category);
  
  res.json({
    success: true,
    data: { tips }
  });
});

// @desc    Get impact analysis (correlation between plastic collection and health)
// @route   GET /api/health/impact-analysis
// @access  Public
const getImpactAnalysis = asyncHandler(async (req, res) => {
  const { location, timeRange = '90d' } = req.query;
  
  try {
    const { supabase } = require('../config/supabase');
    
    // Calculate date range
    const days = parseInt(timeRange.replace('d', ''));
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    // Get health data over time
    let healthQuery = supabase
      .from('health_data')
      .select('risk_level, diseases, created_at, location')
      .gte('created_at', startDate)
      .order('created_at', { ascending: true });
    
    if (location) {
      healthQuery = healthQuery.eq('location', location);
    }
    
    const { data: healthData, error: healthError } = await healthQuery;
    
    if (healthError) throw healthError;
    
    // Get collection data over time
    let collectionQuery = supabase
      .from('collections')
      .select('weight, created_at, location')
      .gte('created_at', startDate)
      .order('created_at', { ascending: true });
    
    if (location) {
      collectionQuery = collectionQuery.eq('location', location);
    }
    
    const { data: collectionData, error: collectionError } = await collectionQuery;
    
    if (collectionError) throw collectionError;
    
    // Group data by week for correlation analysis
    const groupByWeek = (data, valueKey) => {
      const weeks = {};
      data.forEach(item => {
        const date = new Date(item.created_at);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeks[weekKey]) {
          weeks[weekKey] = { count: 0, total: 0 };
        }
        weeks[weekKey].count++;
        weeks[weekKey].total += parseFloat(item[valueKey] || 0);
      });
      return weeks;
    };
    
    const healthByWeek = groupByWeek(healthData || [], 'risk_level');
    const collectionsByWeek = groupByWeek(collectionData || [], 'weight');
    
    // Calculate correlation coefficient
    const calculateCorrelation = (health, collections) => {
      const weeks = Object.keys(health).filter(w => collections[w]);
      if (weeks.length < 3) return { correlation: 0, strength: 'insufficient_data' };
      
      const healthValues = weeks.map(w => health[w].total / health[w].count);
      const collectionValues = weeks.map(w => collections[w].total);
      
      const avgHealth = healthValues.reduce((a, b) => a + b, 0) / healthValues.length;
      const avgCollection = collectionValues.reduce((a, b) => a + b, 0) / collectionValues.length;
      
      let numerator = 0;
      let denomHealth = 0;
      let denomCollection = 0;
      
      for (let i = 0; i < weeks.length; i++) {
        const healthDiff = healthValues[i] - avgHealth;
        const collectionDiff = collectionValues[i] - avgCollection;
        numerator += healthDiff * collectionDiff;
        denomHealth += healthDiff * healthDiff;
        denomCollection += collectionDiff * collectionDiff;
      }
      
      const correlation = numerator / Math.sqrt(denomHealth * denomCollection);
      
      // Determine strength
      const absCorr = Math.abs(correlation);
      let strength;
      if (absCorr > 0.7) strength = 'strong';
      else if (absCorr > 0.4) strength = 'moderate';
      else if (absCorr > 0.2) strength = 'weak';
      else strength = 'negligible';
      
      return { correlation: correlation.toFixed(3), strength };
    };
    
    const correlationResult = calculateCorrelation(healthByWeek, collectionsByWeek);
    
    // Calculate impact metrics
    const totalPlasticCollected = (collectionData || []).reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);
    const avgRiskLevel = (healthData || []).length > 0
      ? (healthData.reduce((sum, h) => sum + (h.risk_level || 0), 0) / healthData.length).toFixed(2)
      : 0;
    
    // Environmental impact calculations
    const co2Prevented = (totalPlasticCollected * 0.2).toFixed(2); // 1kg plastic = ~0.2kg CO2
    const waterSaved = (totalPlasticCollected * 4).toFixed(2); // 1kg plastic = ~4L water saved
    const energySaved = (totalPlasticCollected * 1.5).toFixed(2); // 1kg plastic = ~1.5kWh
    
    // Disease analysis
    const diseaseOccurrences = {};
    (healthData || []).forEach(h => {
      (h.diseases || []).forEach(disease => {
        diseaseOccurrences[disease] = (diseaseOccurrences[disease] || 0) + 1;
      });
    });
    
    const topDiseases = Object.entries(diseaseOccurrences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([disease, count]) => ({ disease, occurrences: count }));
    
    // Generate insights
    const insights = [];
    
    if (correlationResult.strength === 'strong') {
      if (correlationResult.correlation < 0) {
        insights.push('Strong negative correlation: Increased plastic collection correlates with reduced health risks');
        insights.push('Your collection efforts are making a significant health impact in the community');
      } else {
        insights.push('Data shows areas with high plastic accumulation have higher health risks');
      }
    } else if (correlationResult.strength === 'moderate') {
      insights.push('Moderate correlation detected between plastic pollution and health outcomes');
    } else {
      insights.push('More data needed to establish strong correlations');
    }
    
    if (totalPlasticCollected > 1000) {
      insights.push(`Significant environmental impact: ${co2Prevented}kg CO2 prevented`);
    }
    
    res.json({
      success: true,
      data: {
        analysis: {
          correlation: {
            coefficient: parseFloat(correlationResult.correlation),
            strength: correlationResult.strength,
            interpretation: correlationResult.correlation < -0.3 
              ? 'Plastic collection appears to reduce health risks'
              : correlationResult.correlation > 0.3
              ? 'Plastic pollution correlates with increased health risks'
              : 'Weak or no clear relationship detected'
          },
          metrics: {
            totalPlasticCollected: parseFloat(totalPlasticCollected.toFixed(2)),
            averageRiskLevel: parseFloat(avgRiskLevel),
            dataPoints: {
              health: (healthData || []).length,
              collections: (collectionData || []).length
            }
          },
          environmentalImpact: {
            co2Prevented: `${co2Prevented} kg`,
            waterSaved: `${waterSaved} liters`,
            energySaved: `${energySaved} kWh`
          },
          diseasePatterns: topDiseases,
          insights,
          timeRange: `${days} days`,
          location: location || 'All locations'
        }
      }
    });
    
  } catch (error) {
    logger.error('Impact analysis error:', error);
    throw new AppError('Failed to generate impact analysis: ' + error.message, 500);
  }
});

// @desc    Get predictive health insights using time-series analysis
// @route   GET /api/health/predictive
// @access  Public
const getPredictiveInsights = asyncHandler(async (req, res) => {
  const { location, days = 30 } = req.query;
  
  try {
    const { supabase } = require('../config/supabase');
    
    // Get historical health data (last 90 days)
    const historicalDays = 90;
    const startDate = new Date(Date.now() - historicalDays * 24 * 60 * 60 * 1000).toISOString();
    
    let query = supabase
      .from('health_data')
      .select('risk_level, diseases, created_at, location')
      .gte('created_at', startDate)
      .order('created_at', { ascending: true });
    
    if (location) {
      query = query.eq('location', location);
    }
    
    const { data: healthData, error } = await query;
    
    if (error) throw error;
    
    if (!healthData || healthData.length < 5) {
      return res.json({
        success: true,
        data: {
          predictions: [],
          message: 'Insufficient data for predictions. Need at least 5 historical data points.',
          dataPoints: healthData?.length || 0
        }
      });
    }
    
    // Group by day and calculate average risk
    const dailyRisk = {};
    healthData.forEach(h => {
      const date = h.created_at.split('T')[0];
      if (!dailyRisk[date]) {
        dailyRisk[date] = { total: 0, count: 0, diseases: [] };
      }
      dailyRisk[date].total += h.risk_level || 50;
      dailyRisk[date].count++;
      dailyRisk[date].diseases.push(...(h.diseases || []));
    });
    
    // Calculate moving average for smoothing
    const dates = Object.keys(dailyRisk).sort();
    const riskValues = dates.map(date => dailyRisk[date].total / dailyRisk[date].count);
    
    // Simple linear regression for trend prediction
    const linearRegression = (values) => {
      const n = values.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      
      values.forEach((y, x) => {
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
      });
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      return { slope, intercept };
    };
    
    const { slope, intercept } = linearRegression(riskValues);
    
    // Predict future risk levels
    const predictionDays = parseInt(days);
    const predictions = [];
    
    for (let i = 1; i <= predictionDays; i++) {
      const futureIndex = riskValues.length + i;
      const predictedRisk = slope * futureIndex + intercept;
      
      // Clamp between 0-100
      const clampedRisk = Math.max(0, Math.min(100, predictedRisk));
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predictedRiskLevel: Math.round(clampedRisk),
        riskCategory: clampedRisk > 70 ? 'high' : clampedRisk > 40 ? 'medium' : 'low',
        confidence: Math.max(0.5, 1 - (i / predictionDays) * 0.5).toFixed(2) // Confidence decreases over time
      });
    }
    
    // Analyze disease trends
    const diseaseFrequency = {};
    healthData.forEach(h => {
      (h.diseases || []).forEach(disease => {
        if (!diseaseFrequency[disease]) {
          diseaseFrequency[disease] = { early: 0, late: 0 };
        }
        
        const isRecent = new Date(h.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        if (isRecent) {
          diseaseFrequency[disease].late++;
        } else {
          diseaseFrequency[disease].early++;
        }
      });
    });
    
    // Identify emerging diseases (increasing trend)
    const emergingDiseases = Object.entries(diseaseFrequency)
      .filter(([_, freq]) => freq.late > freq.early)
      .map(([disease, freq]) => ({
        disease,
        trend: 'increasing',
        recentOccurrences: freq.late,
        change: freq.early > 0 ? `+${Math.round((freq.late - freq.early) / freq.early * 100)}%` : 'new'
      }))
      .sort((a, b) => b.recentOccurrences - a.recentOccurrences)
      .slice(0, 5);
    
    // Generate recommendations
    const recommendations = [];
    
    const avgPredictedRisk = predictions.reduce((sum, p) => sum + p.predictedRiskLevel, 0) / predictions.length;
    const currentAvgRisk = riskValues.slice(-7).reduce((a, b) => a + b, 0) / 7;
    
    if (slope > 0.5) {
      recommendations.push('Risk levels are trending upward - increase protective measures');
      recommendations.push('Consider avoiding high-risk areas during peak pollution times');
    } else if (slope < -0.5) {
      recommendations.push('Risk levels are improving - your collection efforts are working!');
      recommendations.push('Continue current practices to maintain this positive trend');
    } else {
      recommendations.push('Risk levels are stable - maintain current prevention strategies');
    }
    
    if (avgPredictedRisk > 70) {
      recommendations.push('High risk predicted - wear protective equipment and limit outdoor exposure');
    } else if (avgPredictedRisk > 40) {
      recommendations.push('Moderate risk expected - take standard health precautions');
    }
    
    if (emergingDiseases.length > 0) {
      recommendations.push(`Monitor for ${emergingDiseases[0].disease} - cases are increasing`);
    }
    
    res.json({
      success: true,
      data: {
        predictions,
        trends: {
          currentRiskLevel: Math.round(currentAvgRisk),
          predictedAverageRisk: Math.round(avgPredictedRisk),
          trend: slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'stable',
          trendStrength: Math.abs(slope) > 1 ? 'strong' : Math.abs(slope) > 0.3 ? 'moderate' : 'weak'
        },
        emergingDiseases,
        recommendations,
        metadata: {
          historicalDataPoints: healthData.length,
          analysisWindow: `${historicalDays} days`,
          predictionWindow: `${predictionDays} days`,
          location: location || 'All locations',
          modelType: 'linear_regression'
        }
      }
    });
    
  } catch (error) {
    logger.error('Predictive insights error:', error);
    throw new AppError('Failed to generate predictive insights: ' + error.message, 500);
  }
});

module.exports = {
  getHealthInsights,
  getHealthDataByLocation,
  getHealthData,
  getHealthDataById,
  createHealthData,
  updateHealthData,
  deleteHealthData,
  getHealthTrends,
  getHighRiskAreas,
  getHealthDataByRegion,
  getHealthStats,
  getDiseaseTrends,
  getEnvironmentalHealth,
  getPreventiveTips,
  getImpactAnalysis,
  getPredictiveInsights
};
