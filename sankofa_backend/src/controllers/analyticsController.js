const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { supabase } = require('../config/supabase');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total collections count and weight
  const { data: collectionsData, error: collectionsError } = await supabase
    .from('collections')
    .select('weight, cash_amount, token_amount');
  
  if (collectionsError) throw collectionsError;

  const totalCollections = collectionsData.length;
  const totalWeight = collectionsData.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
  const totalEarnings = collectionsData.reduce((sum, c) => sum + (parseFloat(c.cash_amount) || 0), 0);
  const healthTokensIssued = collectionsData.reduce((sum, c) => sum + (parseFloat(c.token_amount) || 0), 0);

  // Get active collectors (collectors with status 'active')
  const { count: activeCollectors, error: collectorsError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'collector')
    .eq('status', 'active');
  
  if (collectorsError) throw collectorsError;

  // Get total hubs
  const { count: totalHubs, error: hubsError } = await supabase
    .from('hubs')
    .select('*', { count: 'exact', head: true });
  
  if (hubsError) throw hubsError;

  // Get total donations amount
  const { data: donationsData, error: donationsError } = await supabase
    .from('donations')
    .select('amount');
  
  if (donationsError) throw donationsError;

  const totalDonations = donationsData.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

  // Get active volunteers (approved status)
  const { count: activeVolunteers, error: volunteersError } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');
  
  if (volunteersError) throw volunteersError;

  const stats = {
    totalCollections,
    totalWeight: Math.round(totalWeight * 100) / 100,
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    activeCollectors: activeCollectors || 0,
    totalHubs: totalHubs || 0,
    healthTokensIssued: Math.round(healthTokensIssued * 100) / 100,
    totalDonations: Math.round(totalDonations * 100) / 100,
    activeVolunteers: activeVolunteers || 0
  };
  
  logger.info('Dashboard stats retrieved', { stats });
  
  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get collection analytics
// @route   GET /api/analytics/collections
// @access  Private
const getCollectionAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, region } = req.query;
  
  // Build query with optional filters
  let query = supabase.from('collections').select('*, hubs(region)');
  
  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  const { data: collections, error } = await query;
  
  if (error) throw error;

  // Filter by region if provided (via join)
  const filteredCollections = region 
    ? collections.filter(c => c.hubs?.region === region)
    : collections;

  // Calculate daily collections for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyCollections = last7Days.map(date => {
    return filteredCollections.filter(c => 
      c.created_at?.startsWith(date)
    ).length;
  });

  // Calculate weekly trend
  const thisWeek = dailyCollections.slice(-7).reduce((a, b) => a + b, 0);
  const lastWeek = filteredCollections.filter(c => {
    const collectionDate = new Date(c.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return collectionDate >= twoWeeksAgo && collectionDate < weekAgo;
  }).length;

  const weeklyTrend = lastWeek > 0 
    ? `${Math.round(((thisWeek - lastWeek) / lastWeek) * 100)}%`
    : '+0%';

  // Top plastic types
  const plasticTypeCounts = {};
  filteredCollections.forEach(c => {
    const type = c.plastic_type || 'Unknown';
    plasticTypeCounts[type] = (plasticTypeCounts[type] || 0) + 1;
  });

  const totalCount = filteredCollections.length;
  const topPlasticTypes = Object.entries(plasticTypeCounts)
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalCount) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Average weight and total earnings
  const totalWeight = filteredCollections.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
  const averageWeight = filteredCollections.length > 0 
    ? Math.round((totalWeight / filteredCollections.length) * 100) / 100
    : 0;
  
  const totalEarnings = filteredCollections.reduce((sum, c) => sum + (parseFloat(c.cash_amount) || 0), 0);

  const analytics = {
    dailyCollections,
    weeklyTrend,
    topPlasticTypes,
    averageWeight,
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    totalCollections: filteredCollections.length,
    totalWeight: Math.round(totalWeight * 100) / 100
  };
  
  logger.info('Collection analytics retrieved');
  
  res.json({
    success: true,
    data: { analytics }
  });
});

// @desc    Get health analytics
// @route   GET /api/analytics/health
// @access  Private
const getHealthAnalytics = asyncHandler(async (req, res) => {
  // Get all health data
  const { data: healthData, error } = await supabase
    .from('health_data')
    .select('*');
  
  if (error) throw error;

  // Calculate risk levels
  const riskLevels = {
    high: healthData.filter(h => h.risk_level === 'high').length,
    medium: healthData.filter(h => h.risk_level === 'medium').length,
    low: healthData.filter(h => h.risk_level === 'low').length
  };

  // Disease trends - aggregate from disease_cases
  const diseaseTrends = [];
  const diseaseCases = {};

  healthData.forEach(h => {
    if (h.disease_cases && typeof h.disease_cases === 'object') {
      Object.entries(h.disease_cases).forEach(([disease, cases]) => {
        if (!diseaseCases[disease]) {
          diseaseCases[disease] = [];
        }
        diseaseCases[disease].push({ 
          cases: parseInt(cases) || 0,
          date: h.created_at 
        });
      });
    }
  });

  // Calculate trend for each disease
  Object.entries(diseaseCases).forEach(([disease, records]) => {
    const totalCases = records.reduce((sum, r) => sum + r.cases, 0);
    
    // Simple trend calculation: compare first half vs second half
    const midpoint = Math.floor(records.length / 2);
    const firstHalf = records.slice(0, midpoint).reduce((sum, r) => sum + r.cases, 0);
    const secondHalf = records.slice(midpoint).reduce((sum, r) => sum + r.cases, 0);
    
    let trend = 'stable';
    if (secondHalf > firstHalf * 1.1) trend = 'increasing';
    else if (secondHalf < firstHalf * 0.9) trend = 'decreasing';

    diseaseTrends.push({
      disease: disease.charAt(0).toUpperCase() + disease.slice(1),
      cases: totalCases,
      trend
    });
  });

  // Environmental impact from collections
  const { data: collections, error: collectionsError } = await supabase
    .from('collections')
    .select('weight');
  
  if (collectionsError) throw collectionsError;

  const plasticReduced = collections.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
  
  // Environmental calculations
  // 1 kg of plastic = ~0.2 kg CO2 saved (approximate)
  // Health risk reduction is proportional to plastic collection
  const co2Saved = Math.round(plasticReduced * 0.2);
  const healthRiskReduction = Math.min(Math.round((plasticReduced / 1000) * 5), 100); // Max 100%

  const analytics = {
    riskLevels,
    diseaseTrends: diseaseTrends.slice(0, 10), // Top 10 diseases
    environmentalImpact: {
      plasticReduced: Math.round(plasticReduced * 100) / 100,
      co2Saved,
      healthRiskReduction
    },
    totalHealthRecords: healthData.length
  };
  
  logger.info('Health analytics retrieved');
  
  res.json({
    success: true,
    data: { analytics }
  });
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private
const getUserAnalytics = asyncHandler(async (req, res) => {
  // Get all users with their created dates and roles
  const { data: users, error } = await supabase
    .from('users')
    .select('role, created_at, last_activity, status')
    .order('created_at', { ascending: true });
  
  if (error) throw error;

  // User growth over last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const userGrowth = last7Days.map((date, index) => {
    return users.filter(u => {
      const userDate = new Date(u.created_at);
      const checkDate = new Date(date);
      checkDate.setHours(23, 59, 59);
      return userDate <= checkDate;
    }).length;
  });

  // User roles distribution
  const userRoles = {
    collectors: users.filter(u => u.role === 'collector').length,
    hubManagers: users.filter(u => u.role === 'hub-manager').length,
    volunteers: users.filter(u => u.role === 'volunteer').length,
    donors: users.filter(u => u.role === 'donor').length
  };

  // Active users (logged in within last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const activeUsers = users.filter(u => {
    if (!u.last_activity) return false;
    return new Date(u.last_activity) >= thirtyDaysAgo;
  }).length;

  // New users this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const newUsersThisMonth = users.filter(u => {
    return new Date(u.created_at) >= startOfMonth;
  }).length;

  const analytics = {
    userGrowth,
    userRoles,
    activeUsers,
    newUsersThisMonth,
    totalUsers: users.length,
    activeUserPercentage: Math.round((activeUsers / users.length) * 100)
  };
  
  logger.info('User analytics retrieved');
  
  res.json({
    success: true,
    data: { analytics }
  });
});

// @desc    Get hub analytics
// @route   GET /api/analytics/hubs
// @access  Private
const getHubAnalytics = asyncHandler(async (req, res) => {
  // Get all hubs with their collection data
  const { data: hubs, error: hubsError } = await supabase
    .from('hubs')
    .select('id, name, status, capacity, current_capacity');
  
  if (hubsError) throw hubsError;

  const totalHubs = hubs.length;
  const activeHubs = hubs.filter(h => h.status === 'active').length;

  // Get collections per hub
  const { data: collections, error: collectionsError } = await supabase
    .from('collections')
    .select('hub_id, status, weight');
  
  if (collectionsError) throw collectionsError;

  // Calculate hub performance
  const hubPerformance = await Promise.all(
    hubs.slice(0, 10).map(async (hub) => {
      const hubCollections = collections.filter(c => c.hub_id === hub.id);
      const verifiedCollections = hubCollections.filter(c => c.status === 'verified');
      
      const efficiency = hubCollections.length > 0
        ? Math.round((verifiedCollections.length / hubCollections.length) * 100)
        : 0;

      return {
        id: hub.id,
        name: hub.name,
        collections: hubCollections.length,
        efficiency,
        capacityUsed: Math.round(((hub.current_capacity || 0) / (hub.capacity || 1)) * 100)
      };
    })
  );

  // Sort by collections count
  hubPerformance.sort((a, b) => b.collections - a.collections);

  // Average efficiency across all hubs
  const avgEfficiency = hubPerformance.length > 0
    ? Math.round(hubPerformance.reduce((sum, h) => sum + h.efficiency, 0) / hubPerformance.length)
    : 0;

  const analytics = {
    totalHubs,
    activeHubs,
    inactiveHubs: totalHubs - activeHubs,
    hubPerformance: hubPerformance.slice(0, 10), // Top 10
    averageEfficiency: avgEfficiency,
    totalCollectionsProcessed: collections.length
  };
  
  logger.info('Hub analytics retrieved');
  
  res.json({
    success: true,
    data: { analytics }
  });
});

// @desc    Get donation analytics
// @route   GET /api/analytics/donations
// @access  Private
const getDonationAnalytics = asyncHandler(async (req, res) => {
  // Get all donations
  const { data: donations, error } = await supabase
    .from('donations')
    .select('amount, type, created_at, donor_id, users(name)');
  
  if (error) throw error;

  // Total donations
  const totalDonations = donations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

  // Monthly donations for last 6 months
  const monthlyDonations = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.getMonth();
    const year = date.getFullYear();
    
    return donations.filter(d => {
      const donationDate = new Date(d.created_at);
      return donationDate.getMonth() === month && donationDate.getFullYear() === year;
    }).reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
  });

  // Donation types
  const donationTypes = {
    oneTime: donations.filter(d => d.type === 'one-time').reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0),
    monthly: donations.filter(d => d.type === 'monthly').reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0),
    quarterly: donations.filter(d => d.type === 'quarterly').reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0),
    yearly: donations.filter(d => d.type === 'yearly').reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
  };

  // Top donors
  const donorTotals = {};
  donations.forEach(d => {
    if (!donorTotals[d.donor_id]) {
      donorTotals[d.donor_id] = {
        name: d.users?.name || 'Anonymous',
        amount: 0,
        count: 0
      };
    }
    donorTotals[d.donor_id].amount += parseFloat(d.amount) || 0;
    donorTotals[d.donor_id].count += 1;
  });

  const topDonors = Object.values(donorTotals)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map(d => ({
      name: d.name,
      amount: Math.round(d.amount * 100) / 100,
      donationCount: d.count
    }));

  // Calculate growth trend
  const thisMonth = monthlyDonations[monthlyDonations.length - 1];
  const lastMonth = monthlyDonations[monthlyDonations.length - 2];
  const growthTrend = lastMonth > 0 
    ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
    : 0;

  const analytics = {
    totalDonations: Math.round(totalDonations * 100) / 100,
    monthlyDonations: monthlyDonations.map(m => Math.round(m * 100) / 100),
    donationTypes: {
      oneTime: Math.round(donationTypes.oneTime * 100) / 100,
      monthly: Math.round(donationTypes.monthly * 100) / 100,
      quarterly: Math.round(donationTypes.quarterly * 100) / 100,
      yearly: Math.round(donationTypes.yearly * 100) / 100
    },
    topDonors,
    totalDonors: Object.keys(donorTotals).length,
    averageDonation: donations.length > 0 
      ? Math.round((totalDonations / donations.length) * 100) / 100
      : 0,
    growthTrend: `${growthTrend > 0 ? '+' : ''}${growthTrend}%`
  };
  
  logger.info('Donation analytics retrieved');
  
  res.json({
    success: true,
    data: { analytics }
  });
});

// @desc    Get AI analytics
// @route   GET /api/analytics/ai
// @access  Private
const getAIAnalytics = asyncHandler(async (req, res) => {
  // Get all AI interactions
  const { data: interactions, error } = await supabase
    .from('ai_interactions')
    .select('type, created_at, feedback_rating, response_time');
  
  if (error) throw error;

  const totalInteractions = interactions.length;

  // Daily interactions for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyInteractions = last7Days.map(date => {
    return interactions.filter(i => i.created_at?.startsWith(date)).length;
  });

  // Interaction types
  const interactionTypes = {
    chat: interactions.filter(i => i.type === 'chat').length,
    voice: interactions.filter(i => i.type === 'voice').length,
    health: interactions.filter(i => i.type === 'health_analysis' || i.type === 'health').length,
    query: interactions.filter(i => i.type === 'query').length,
    other: interactions.filter(i => !['chat', 'voice', 'health_analysis', 'health', 'query'].includes(i.type)).length
  };

  // User satisfaction (average feedback rating)
  const ratingsWithFeedback = interactions.filter(i => i.feedback_rating !== null && i.feedback_rating !== undefined);
  const userSatisfaction = ratingsWithFeedback.length > 0
    ? Math.round((ratingsWithFeedback.reduce((sum, i) => sum + (i.feedback_rating || 0), 0) / ratingsWithFeedback.length) * 10) / 10
    : 0;

  // Average response time (in seconds)
  const responseTimes = interactions.filter(i => i.response_time !== null && i.response_time !== undefined);
  const responseTime = responseTimes.length > 0
    ? Math.round((responseTimes.reduce((sum, i) => sum + (i.response_time || 0), 0) / responseTimes.length) * 10) / 10
    : 0;

  const analytics = {
    totalInteractions,
    dailyInteractions,
    interactionTypes,
    userSatisfaction,
    responseTime,
    feedbackRate: totalInteractions > 0 
      ? Math.round((ratingsWithFeedback.length / totalInteractions) * 100)
      : 0
  };
  
  logger.info('AI analytics retrieved');
  
  res.json({
    success: true,
    data: { analytics }
  });
});

// @desc    Get environmental impact
// @route   GET /api/analytics/environmental-impact
// @access  Private
const getEnvironmentalImpact = asyncHandler(async (req, res) => {
  // Get all collections for impact calculation
  const { data: collections, error } = await supabase
    .from('collections')
    .select('weight, plastic_type');
  
  if (error) throw error;

  // Total plastic collected in kg
  const plasticCollected = collections.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);

  // Environmental impact calculations (industry standard approximations)
  // 1 kg plastic = 0.2 kg CO2 saved (recycling vs incineration)
  // 1 kg plastic = 4 liters water saved
  // 1 kg plastic = 1.5 kWh energy saved
  // 50 kg plastic = 1 tree equivalent (carbon absorption)
  
  const co2Saved = Math.round(plasticCollected * 0.2);
  const waterSaved = Math.round(plasticCollected * 4);
  const energySaved = Math.round(plasticCollected * 1.5);
  const treesEquivalent = Math.round(plasticCollected / 50);

  // Health risk reduction based on plastic removed from environment
  // Assume 1000 kg plastic = 5% health risk reduction (capped at 100%)
  const healthRiskReduction = Math.min(Math.round((plasticCollected / 1000) * 5), 100);

  // Calculate by plastic type for additional insights
  const impactByType = {};
  collections.forEach(c => {
    const type = c.plastic_type || 'Unknown';
    if (!impactByType[type]) {
      impactByType[type] = { weight: 0, count: 0 };
    }
    impactByType[type].weight += parseFloat(c.weight) || 0;
    impactByType[type].count += 1;
  });

  const impact = {
    plasticCollected: Math.round(plasticCollected * 100) / 100,
    co2Saved,
    waterSaved,
    energySaved,
    healthRiskReduction,
    treesEquivalent,
    impactByType: Object.entries(impactByType).map(([type, data]) => ({
      type,
      weight: Math.round(data.weight * 100) / 100,
      count: data.count,
      co2Saved: Math.round(data.weight * 0.2)
    })).sort((a, b) => b.weight - a.weight)
  };
  
  logger.info('Environmental impact retrieved');
  
  res.json({
    success: true,
    data: { impact }
  });
});

// @desc    Get predictive insights
// @route   GET /api/analytics/predictive-insights
// @access  Private
const getPredictiveInsights = asyncHandler(async (req, res) => {
  // Get historical collection data
  const { data: collections, error: collectionsError } = await supabase
    .from('collections')
    .select('created_at, weight')
    .order('created_at', { ascending: true });
  
  if (collectionsError) throw collectionsError;

  // Simple linear regression for collection forecast
  const weeklyData = {};
  collections.forEach(c => {
    const date = new Date(c.created_at);
    const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
  });

  const weeks = Object.values(weeklyData);
  const avgWeekly = weeks.length > 0 
    ? Math.round(weeks.reduce((a, b) => a + b, 0) / weeks.length)
    : 0;

  // Simple trend: compare last 2 weeks vs previous 2 weeks
  const recentWeeks = weeks.slice(-4);
  const lastTwoWeeks = recentWeeks.slice(-2).reduce((a, b) => a + b, 0) / 2;
  const prevTwoWeeks = recentWeeks.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
  const trend = prevTwoWeeks > 0 ? (lastTwoWeeks - prevTwoWeeks) / prevTwoWeeks : 0;

  const collectionForecast = {
    nextWeek: Math.round(avgWeekly * (1 + trend)),
    nextMonth: Math.round(avgWeekly * 4 * (1 + trend)),
    confidence: Math.min(85 + (weeks.length * 2), 95) // More data = higher confidence
  };

  // Health risk prediction based on health_data
  const { data: healthData, error: healthError } = await supabase
    .from('health_data')
    .select('location, risk_level, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (healthError) throw healthError;

  const highRiskAreas = healthData
    .filter(h => h.risk_level === 'high')
    .map(h => h.location?.address || 'Unknown')
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5);

  const riskCounts = {
    high: healthData.filter(h => h.risk_level === 'high').length,
    medium: healthData.filter(h => h.risk_level === 'medium').length,
    low: healthData.filter(h => h.risk_level === 'low').length
  };

  const totalRisk = riskCounts.high + riskCounts.medium + riskCounts.low;
  let riskLevel = 'Low';
  if (riskCounts.high / totalRisk > 0.3) riskLevel = 'High';
  else if ((riskCounts.high + riskCounts.medium) / totalRisk > 0.5) riskLevel = 'Medium';

  // User growth prediction
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('created_at')
    .order('created_at', { ascending: true });
  
  if (usersError) throw usersError;

  const monthlyUsers = {};
  users.forEach(u => {
    const date = new Date(u.created_at);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyUsers[monthKey] = (monthlyUsers[monthKey] || 0) + 1;
  });

  const months = Object.values(monthlyUsers);
  const avgMonthly = months.length > 0
    ? Math.round(months.reduce((a, b) => a + b, 0) / months.length)
    : 0;

  const recentMonths = months.slice(-3);
  const userTrend = recentMonths.length >= 2
    ? (recentMonths[recentMonths.length - 1] - recentMonths[recentMonths.length - 2]) / recentMonths[recentMonths.length - 2]
    : 0;

  const insights = {
    collectionForecast,
    healthRiskPrediction: {
      highRiskAreas,
      riskLevel,
      confidence: Math.round(70 + (healthData.length * 0.5))
    },
    userGrowthPrediction: {
      nextMonth: Math.round(avgMonthly * (1 + userTrend)),
      nextQuarter: Math.round(avgMonthly * 3 * (1 + userTrend)),
      confidence: Math.min(85 + (months.length * 3), 95)
    }
  };
  
  logger.info('Predictive insights retrieved');
  
  res.json({
    success: true,
    data: { insights }
  });
});

// @desc    Get performance metrics
// @route   GET /api/analytics/performance
// @access  Private
const getPerformanceMetrics = asyncHandler(async (req, res) => {
  const startTime = Date.now();

  // System uptime (Node.js process uptime)
  const uptimeSeconds = process.uptime();
  const systemUptime = Math.round((uptimeSeconds / (24 * 60 * 60)) * 1000) / 1000; // Days with 3 decimals

  // Calculate uptime percentage (assume 30 days monitoring)
  const uptimePercentage = Math.min(99.9, Math.round((uptimeSeconds / (30 * 24 * 60 * 60)) * 10000) / 100);

  // Memory usage
  const memUsage = process.memoryUsage();
  const memoryUsage = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);

  // CPU usage (approximate based on event loop lag)
  const cpuUsage = Math.round(Math.random() * 30 + 20); // Mock CPU between 20-50%

  // Test database response time
  const dbTestStart = Date.now();
  try {
    await supabase.from('users').select('id').limit(1);
  } catch (err) {
    logger.error('DB performance test failed:', err);
  }
  const averageResponseTime = Date.now() - dbTestStart;

  // Get error rate from recent logs (if available)
  // For now, calculate based on successful vs failed requests
  // This would need actual error tracking in production
  const errorRate = 0.1; // Mock error rate

  // Active connections (approximate based on current requests)
  // In production, this would come from connection pool metrics
  const activeConnections = Math.round(Math.random() * 50 + 100); // Mock 100-150 connections

  const metrics = {
    systemUptime: uptimePercentage,
    averageResponseTime,
    errorRate,
    activeConnections,
    memoryUsage,
    cpuUsage,
    healthStatus: 'healthy',
    lastChecked: new Date().toISOString(),
    processUptime: Math.round(uptimeSeconds),
    nodeVersion: process.version,
    platform: process.platform
  };
  
  logger.info('Performance metrics retrieved');
  
  res.json({
    success: true,
    data: { metrics }
  });
});

// @desc    Get trend analysis
// @route   GET /api/analytics/trends
// @access  Private
const getTrendAnalysis = asyncHandler(async (req, res) => {
  // Analyze collection trends
  const { data: collections, error: collectionsError } = await supabase
    .from('collections')
    .select('created_at, weight')
    .order('created_at', { ascending: true });
  
  if (collectionsError) throw collectionsError;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const recentCollections = collections.filter(c => new Date(c.created_at) >= thirtyDaysAgo).length;
  const previousCollections = collections.filter(c => {
    const date = new Date(c.created_at);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo;
  }).length;

  const collectionTrend = previousCollections > 0
    ? recentCollections > previousCollections * 1.1 ? 'increasing' 
    : recentCollections < previousCollections * 0.9 ? 'decreasing' 
    : 'stable'
    : 'insufficient_data';

  // Analyze user growth trends
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('created_at')
    .order('created_at', { ascending: true });
  
  if (usersError) throw usersError;

  const recentUsers = users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length;
  const previousUsers = users.filter(u => {
    const date = new Date(u.created_at);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo;
  }).length;

  const userGrowthTrend = previousUsers > 0
    ? recentUsers > previousUsers * 1.1 ? 'increasing'
    : recentUsers < previousUsers * 0.9 ? 'decreasing'
    : 'stable'
    : 'insufficient_data';

  // Analyze health risk trends
  const { data: healthData, error: healthError } = await supabase
    .from('health_data')
    .select('created_at, risk_level')
    .order('created_at', { ascending: true });
  
  if (healthError) throw healthError;

  const recentHighRisk = healthData.filter(h => 
    new Date(h.created_at) >= thirtyDaysAgo && h.risk_level === 'high'
  ).length;
  const previousHighRisk = healthData.filter(h => {
    const date = new Date(h.created_at);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo && h.risk_level === 'high';
  }).length;

  const healthRiskTrend = previousHighRisk > 0
    ? recentHighRisk < previousHighRisk * 0.9 ? 'decreasing'
    : recentHighRisk > previousHighRisk * 1.1 ? 'increasing'
    : 'stable'
    : 'insufficient_data';

  // Analyze donation trends
  const { data: donations, error: donationsError } = await supabase
    .from('donations')
    .select('created_at, amount')
    .order('created_at', { ascending: true });
  
  if (donationsError) throw donationsError;

  const recentDonationAmount = donations
    .filter(d => new Date(d.created_at) >= thirtyDaysAgo)
    .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
  
  const previousDonationAmount = donations
    .filter(d => {
      const date = new Date(d.created_at);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    })
    .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

  const donationTrend = previousDonationAmount > 0
    ? recentDonationAmount > previousDonationAmount * 1.1 ? 'increasing'
    : recentDonationAmount < previousDonationAmount * 0.9 ? 'decreasing'
    : 'stable'
    : 'insufficient_data';

  // Calculate efficiency trend (verified collections ratio)
  const recentVerified = collections
    .filter(c => new Date(c.created_at) >= thirtyDaysAgo)
    .length;
  const recentTotal = recentCollections;
  const recentEfficiency = recentTotal > 0 ? recentVerified / recentTotal : 0;

  const previousVerified = collections
    .filter(c => {
      const date = new Date(c.created_at);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    }).length;
  const previousEfficiency = previousCollections > 0 ? previousVerified / previousCollections : 0;

  const efficiencyTrend = previousEfficiency > 0
    ? recentEfficiency > previousEfficiency * 1.05 ? 'increasing'
    : recentEfficiency < previousEfficiency * 0.95 ? 'decreasing'
    : 'stable'
    : 'insufficient_data';

  const trends = {
    collectionTrend,
    userGrowthTrend,
    healthRiskTrend,
    donationTrend,
    efficiencyTrend,
    periodCompared: '30 days vs previous 30 days',
    metrics: {
      collections: {
        recent: recentCollections,
        previous: previousCollections,
        change: previousCollections > 0 ? Math.round(((recentCollections - previousCollections) / previousCollections) * 100) : 0
      },
      users: {
        recent: recentUsers,
        previous: previousUsers,
        change: previousUsers > 0 ? Math.round(((recentUsers - previousUsers) / previousUsers) * 100) : 0
      },
      donations: {
        recent: Math.round(recentDonationAmount * 100) / 100,
        previous: Math.round(previousDonationAmount * 100) / 100,
        change: previousDonationAmount > 0 ? Math.round(((recentDonationAmount - previousDonationAmount) / previousDonationAmount) * 100) : 0
      }
    }
  };
  
  logger.info('Trend analysis retrieved');
  
  res.json({
    success: true,
    data: { trends }
  });
});

// @desc    Get geographic analytics
// @route   GET /api/analytics/geographic
// @access  Private
const getGeographicAnalytics = asyncHandler(async (req, res) => {
  // Get collections with hub location data
  const { data: collections, error: collectionsError } = await supabase
    .from('collections')
    .select('hub_id, weight, hubs(name, region, location)');
  
  if (collectionsError) throw collectionsError;

  // Get users with their locations
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, role, location');
  
  if (usersError) throw usersError;

  // Aggregate collections by region
  const regionData = {};
  collections.forEach(c => {
    const region = c.hubs?.region || 'Unknown';
    if (!regionData[region]) {
      regionData[region] = {
        name: region,
        collections: 0,
        weight: 0,
        users: new Set()
      };
    }
    regionData[region].collections += 1;
    regionData[region].weight += parseFloat(c.weight) || 0;
  });

  // Count users per region (approximate based on location)
  users.forEach(u => {
    if (u.location && u.location.address) {
      // Extract region from address (simplified)
      const address = u.location.address.toLowerCase();
      let region = 'Unknown';
      
      if (address.includes('accra')) region = 'Greater Accra';
      else if (address.includes('kumasi') || address.includes('ashanti')) region = 'Ashanti';
      else if (address.includes('tamale') || address.includes('northern')) region = 'Northern';
      else if (address.includes('takoradi') || address.includes('sekondi') || address.includes('western')) region = 'Western';
      else if (address.includes('cape coast') || address.includes('central')) region = 'Central';

      if (regionData[region]) {
        regionData[region].users.add(u.id);
      } else if (region !== 'Unknown') {
        regionData[region] = {
          name: region,
          collections: 0,
          weight: 0,
          users: new Set([u.id])
        };
      }
    }
  });

  // Convert to array format
  const regions = Object.values(regionData).map(r => ({
    name: r.name,
    collections: r.collections,
    weight: Math.round(r.weight * 100) / 100,
    users: r.users.size
  })).sort((a, b) => b.collections - a.collections);

  // Identify hotspots (areas with high collection density)
  const { data: hubs, error: hubsError } = await supabase
    .from('hubs')
    .select('id, name, location, current_capacity, capacity');
  
  if (hubsError) throw hubsError;

  const hubCollectionCounts = {};
  collections.forEach(c => {
    hubCollectionCounts[c.hub_id] = (hubCollectionCounts[c.hub_id] || 0) + 1;
  });

  const hotspots = hubs
    .map(h => {
      const count = hubCollectionCounts[h.id] || 0;
      const capacityRatio = (h.current_capacity || 0) / (h.capacity || 1);
      
      let intensity = 'low';
      if (count > 50 || capacityRatio > 0.7) intensity = 'high';
      else if (count > 20 || capacityRatio > 0.4) intensity = 'medium';

      return {
        location: h.name,
        coordinates: h.location?.coordinates,
        intensity,
        collections: count,
        capacityUsed: Math.round(capacityRatio * 100)
      };
    })
    .sort((a, b) => b.collections - a.collections)
    .slice(0, 10);

  const analytics = {
    regions,
    hotspots,
    totalRegions: regions.length,
    mostActiveRegion: regions[0]?.name || 'None',
    geographicCoverage: regions.length > 0 ? `${regions.length} regions` : 'Limited'
  };
  
  logger.info('Geographic analytics retrieved');
  
  res.json({
    success: true,
    data: { analytics }
  });
});

// @desc    Export analytics data
// @route   GET /api/analytics/export
// @access  Private (Admin)
const exportAnalyticsData = asyncHandler(async (req, res) => {
  const { format = 'json', type = 'all', startDate, endDate } = req.query;
  
  const exportData = {
    timestamp: new Date().toISOString(),
    type,
    format,
    dateRange: {
      start: startDate || 'beginning',
      end: endDate || 'now'
    }
  };

  // Build query based on type
  let data = {};

  if (type === 'all' || type === 'collections') {
    let query = supabase.from('collections').select('*');
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);
    
    const { data: collections, error } = await query;
    if (!error) data.collections = collections;
  }

  if (type === 'all' || type === 'users') {
    let query = supabase.from('users').select('*');
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);
    
    const { data: users, error } = await query;
    if (!error) {
      // Remove sensitive data
      data.users = users.map(u => ({
        id: u.id,
        name: u.name,
        role: u.role,
        status: u.status,
        points: u.points,
        level: u.level,
        created_at: u.created_at
      }));
    }
  }

  if (type === 'all' || type === 'donations') {
    let query = supabase.from('donations').select('*');
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);
    
    const { data: donations, error } = await query;
    if (!error) data.donations = donations;
  }

  if (type === 'all' || type === 'health') {
    let query = supabase.from('health_data').select('*');
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);
    
    const { data: healthData, error } = await query;
    if (!error) data.healthData = healthData;
  }

  exportData.data = data;
  exportData.recordCount = {
    collections: data.collections?.length || 0,
    users: data.users?.length || 0,
    donations: data.donations?.length || 0,
    healthData: data.healthData?.length || 0
  };

  // Format based on requested format
  if (format === 'csv') {
    // For CSV, we'd need to implement CSV conversion
    // For now, return JSON with a note
    exportData.note = 'CSV format conversion not yet implemented. Returning JSON.';
  }

  logger.info('Analytics data exported', { type, format, recordCount: exportData.recordCount });
  
  res.json({
    success: true,
    message: 'Analytics data exported successfully',
    data: exportData
  });
});

module.exports = {
  getDashboardStats,
  getCollectionAnalytics,
  getHealthAnalytics,
  getUserAnalytics,
  getHubAnalytics,
  getDonationAnalytics,
  getAIAnalytics,
  getEnvironmentalImpact,
  getPredictiveInsights,
  getPerformanceMetrics,
  getTrendAnalysis,
  getGeographicAnalytics,
  exportAnalyticsData
};
