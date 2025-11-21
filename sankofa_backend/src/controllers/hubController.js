const Hub = require('../models/Hub');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Get all hubs
// @route   GET /api/hubs
// @access  Private
const getHubs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  
  const options = {
    limit: parseInt(limit),
    offset: (page - 1) * parseInt(limit),
    sort: 'created_at',
    order: 'desc'
  };

  const { hubs, total } = await Hub.find(filter, options);

  res.json({
    success: true,
    data: {
      hubs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get hub by ID
// @route   GET /api/hubs/:id
// @access  Private
const getHubById = asyncHandler(async (req, res) => {
  const hub = await Hub.findById(req.params.id);

  if (!hub) {
    throw new AppError('Hub not found', 404);
  }

  res.json({
    success: true,
    data: { hub }
  });
});

// @desc    Create hub
// @route   POST /api/hubs
// @access  Private (Admin)
const createHub = asyncHandler(async (req, res) => {
  const hub = await Hub.create(req.body);
  
  logger.info('Hub created', { hubId: hub.id, name: hub.name });

  res.status(201).json({
    success: true,
    message: 'Hub created successfully',
    data: { hub }
  });
});

// @desc    Update hub
// @route   PUT /api/hubs/:id
// @access  Private (Admin, Hub Manager)
const updateHub = asyncHandler(async (req, res) => {
  const hub = await Hub.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  if (!hub) {
    throw new AppError('Hub not found', 404);
  }

  res.json({
    success: true,
    message: 'Hub updated successfully',
    data: { hub }
  });
});

// @desc    Delete hub
// @route   DELETE /api/hubs/:id
// @access  Private (Admin)
const deleteHub = asyncHandler(async (req, res) => {
  const hub = await Hub.findByIdAndDelete(req.params.id);

  if (!hub) {
    throw new AppError('Hub not found', 404);
  }

  res.json({
    success: true,
    message: 'Hub deleted successfully'
  });
});

// @desc    Get nearby hubs
// @route   GET /api/hubs/nearby
// @access  Private
const getNearbyHubs = asyncHandler(async (req, res) => {
  const { coordinates, radius = 10 } = req.query;
  
  if (!coordinates) {
    throw new AppError('Coordinates are required', 400);
  }
  
  const [longitude, latitude] = coordinates.split(',').map(Number);
  const hubs = await Hub.getNearbyHubs([longitude, latitude], parseFloat(radius));
  
  res.json({
    success: true,
    data: { hubs }
  });
});

// @desc    Get hub statistics
// @route   GET /api/hubs/stats
// @access  Private (Admin)
const getHubStats = asyncHandler(async (req, res) => {
  const stats = await Hub.getHubStats();
  
  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get top performing hubs
// @route   GET /api/hubs/top-performing
// @access  Private
const getTopPerformingHubs = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const topHubs = await Hub.getTopPerformingHubs(parseInt(limit));
  
  res.json({
    success: true,
    data: { topHubs }
  });
});

// @desc    Update hub status
// @route   PATCH /api/hubs/:id/status
// @access  Private (Admin, Hub Manager)
const updateHubStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const hub = await Hub.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!hub) {
    throw new AppError('Hub not found', 404);
  }

  res.json({
    success: true,
    message: 'Hub status updated successfully',
    data: { hub }
  });
});

// @desc    Get hub collectors
// @route   GET /api/hubs/:id/collectors
// @access  Private (Hub Manager, Admin)
const getHubCollectors = asyncHandler(async (req, res) => {
  const collectors = await Hub.getHubCollectors(req.params.id);
  
  res.json({
    success: true,
    data: { collectors }
  });
});

// @desc    Get hub collections
// @route   GET /api/hubs/:id/collections
// @access  Private (Hub Manager, Admin)
const getHubCollections = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const collections = await Hub.getHubCollections(req.params.id, parseInt(page), parseInt(limit));
  
  res.json({
    success: true,
    data: { collections }
  });
});

// @desc    Get hub analytics
// @route   GET /api/hubs/:id/analytics
// @access  Private (Hub Manager, Admin)
const getHubAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Hub.getHubAnalytics(req.params.id);
  
  res.json({
    success: true,
    data: { analytics }
  });
});

// @desc    Get hub dashboard data
// @route   GET /api/hubs/:id/dashboard
// @access  Private (Hub Manager, Admin)
const getHubDashboard = async (req, res) => {
  const hubId = req.params.id;
  const { supabase } = require('../config/supabase');

  // Get hub details
  const { data: hub, error: hubError } = await supabase
    .from('hubs')
    .select('*')
    .eq('id', hubId)
    .single();

  if (hubError || !hub) {
    return res.status(404).json({
      success: false,
      message: 'Hub not found'
    });
  }

  // Get today's collections count
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: todayCount } = await supabase
    .from('collections')
    .select('*', { count: 'exact', head: true })
    .eq('hub', hubId)
    .gte('created_at', today.toISOString());

  // Get weekly collections
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { count: weeklyCount } = await supabase
    .from('collections')
    .select('*', { count: 'exact', head: true })
    .eq('hub', hubId)
    .gte('created_at', weekAgo.toISOString());

  // Get monthly collections
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const { count: monthlyCount } = await supabase
    .from('collections')
    .select('*', { count: 'exact', head: true })
    .eq('hub', hubId)
    .gte('created_at', monthAgo.toISOString());

  // Get active collectors (collected in last 30 days)
  const { data: activeCollectors } = await supabase
    .from('collections')
    .select('collector')
    .eq('hub', hubId)
    .gte('created_at', monthAgo.toISOString());

  const uniqueCollectors = [...new Set(activeCollectors?.map(c => c.collector))];

  // Get pending verifications
  const { count: pendingCount } = await supabase
    .from('collections')
    .select('*', { count: 'exact', head: true })
    .eq('hub', hubId)
    .eq('status', 'pending');

  // Get top collectors
  const { data: topCollectors } = await supabase
    .from('collections')
    .select('collector, collector:users(name, email)')
    .eq('hub', hubId)
    .gte('created_at', monthAgo.toISOString())
    .limit(10);

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from('collections')
    .select('*, collector:users(name, email)')
    .eq('hub', hubId)
    .order('created_at', { ascending: false })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      hub,
      stats: {
        todayCollections: todayCount || 0,
        weeklyCollections: weeklyCount || 0,
        monthlyCollections: monthlyCount || 0,
        activeCollectors: uniqueCollectors.length,
        pendingVerifications: pendingCount || 0
      },
      topCollectors: topCollectors || [],
      recentTransactions: recentTransactions || []
    }
  });
};

// @desc    Get pending collections for verification
// @route   GET /api/hubs/:id/pending-collections
// @access  Private (Hub Manager, Admin)
const getPendingCollections = async (req, res) => {
  const hubId = req.params.id;
  const { supabase } = require('../config/supabase');

  const { data: collections, error } = await supabase
    .from('collections')
    .select('*, collector:users(name, email, phone)')
    .eq('hub', hubId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching pending collections',
      error: error.message
    });
  }

  res.status(200).json({
    success: true,
    count: collections.length,
    data: collections
  });
};

// @desc    Search for collector by phone number
// @route   GET /api/hubs/:id/search-collector?phone=xxx
// @access  Private (Hub Manager, Admin)
const searchCollector = async (req, res) => {
  const { phone } = req.query;
  const { supabase } = require('../config/supabase');

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    });
  }

  const { data: collectors, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'collector')
    .eq('phone', phone);

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error searching for collector',
      error: error.message
    });
  }

  res.status(200).json({
    success: true,
    found: collectors && collectors.length > 0,
    data: collectors && collectors.length > 0 ? collectors[0] : null
  });
};

// @desc    Register new collector (simple)
// @route   POST /api/hubs/:id/register-collector
// @access  Private (Hub Manager, Admin)
const registerCollector = async (req, res) => {
  const { phone, name, neighborhood } = req.body;
  const hubId = req.params.id;
  const { supabase } = require('../config/supabase');

  // Check if collector already exists
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .eq('role', 'collector')
    .single();

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Collector with this phone number already exists'
    });
  }

  // Create collector account
  const { data: collector, error } = await supabase
    .from('users')
    .insert([{
      name,
      phone,
      email: `${phone}@sankofa.placeholder`, // Placeholder email
      role: 'collector',
      neighborhood,
      registered_by_hub: hubId,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error registering collector',
      error: error.message
    });
  }

  res.status(201).json({
    success: true,
    message: 'Collector registered successfully',
    data: collector
  });
};

// @desc    Register new collector (full details)
// @route   POST /api/hubs/:id/register-collector-full
// @access  Private (Hub Manager, Admin)
const registerCollectorFull = async (req, res) => {
  const {
    collectorId,
    cardNumber,
    fullName,
    phoneNumber,
    hasPhone,
    emergencyContact,
    neighborhood,
    landmark,
    preferredLanguage,
    canRead,
    photo,
    physicalIdNumber,
    notes
  } = req.body;

  const hubId = req.params.id;
  const { supabaseAdmin } = require('../config/supabase');

  try {
    // Check if collector already exists (by phone or card number)
    if (phoneNumber && hasPhone !== 'no') {
      const { data: existingByPhone } = await supabaseAdmin
        .from('collectors')
        .select('*')
        .eq('phone', phoneNumber)
        .maybeSingle();

      if (existingByPhone) {
        return res.status(400).json({
          success: false,
          message: 'A collector with this phone number already exists'
        });
      }
    }

    // Check if card number already exists
    const { data: existingByCard } = await supabaseAdmin
      .from('collectors')
      .select('*')
      .eq('card_number', cardNumber)
      .maybeSingle();

    if (existingByCard) {
      return res.status(400).json({
        success: false,
        message: 'This card number is already in use'
      });
    }

    // Create collector record
    const { data: collector, error } = await supabaseAdmin
      .from('collectors')
      .insert([{
        card_number: cardNumber,
        full_name: fullName,
        phone: phoneNumber || null,
        has_phone: hasPhone,
        emergency_contact: emergencyContact,
        neighborhood,
        landmark,
        preferred_language: preferredLanguage,
        can_read: canRead,
        photo,
        physical_id_number: physicalIdNumber,
        notes,
        primary_hub_id: hubId,
        registered_by: req.user.id,
        status: 'active',
        verification_status: 'verified',
        registered_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      logger.error('Error registering collector:', error);
      return res.status(500).json({
        success: false,
        message: 'Error registering collector',
        error: error.message
      });
    }

    // Update hub statistics
    await supabaseAdmin
      .from('hubs')
      .update({
        total_collectors: supabaseAdmin.raw('total_collectors + 1'),
        updated_at: new Date().toISOString()
      })
      .eq('id', hubId);

    logger.info(`Collector registered: ${fullName} (${cardNumber}) at hub ${hubId}`);

    res.status(201).json({
      success: true,
      message: 'Collector registered successfully with full details',
      data: collector
    });
  } catch (error) {
    logger.error('Error in registerCollectorFull:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while registering collector'
    });
  }
};

// @desc    Process collection transaction
// @route   POST /api/hubs/:id/transactions
// @access  Private (Hub Manager, Admin)
const processTransaction = async (req, res) => {
  const {
    collectorId,
    collectorPhone,
    plasticType,
    weight,
    location,
    totalValue,
    instantCash,
    savingsToken
  } = req.body;

  const hubId = req.params.id;
  const { supabase } = require('../config/supabase');

  // Verify collector exists
  const { data: collector, error: collectorError } = await supabase
    .from('users')
    .select('*')
    .eq('id', collectorId)
    .eq('role', 'collector')
    .single();

  if (collectorError || !collector) {
    return res.status(404).json({
      success: false,
      message: 'Collector not found'
    });
  }

  // Create collection record
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .insert([{
      collector: collectorId,
      hub: hubId,
      plastic_type: plasticType,
      weight: weight,
      quantity: 1,
      collection_location: location ? {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      } : null,
      status: 'verified',
      verified_by: req.user.id,
      verified_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (collectionError) {
    return res.status(500).json({
      success: false,
      message: 'Error creating collection record',
      error: collectionError.message
    });
  }

  // Create payment/transaction record
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert([{
      user_id: collectorId,
      collection_id: collection.id,
      amount: totalValue,
      instant_cash: instantCash,
      health_tokens: savingsToken,
      status: 'completed',
      payment_method: 'cash',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (paymentError) {
    // Rollback collection if payment fails
    await supabase.from('collections').delete().eq('id', collection.id);

    return res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: paymentError.message
    });
  }

  res.status(201).json({
    success: true,
    message: 'Transaction processed successfully',
    data: {
      collection,
      payment
    }
  });
};

module.exports = {
  getHubs,
  getHubById,
  createHub,
  updateHub,
  deleteHub,
  getNearbyHubs,
  getHubStats,
  getTopPerformingHubs,
  updateHubStatus,
  getHubCollectors,
  getHubCollections,
  getHubAnalytics,
  getHubDashboard,
  getPendingCollections,
  searchCollector,
  registerCollector,
  registerCollectorFull,
  processTransaction
};
