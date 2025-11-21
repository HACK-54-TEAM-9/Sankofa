const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { supabase } = require('../config/supabase');
const Paystack = require('paystack-api');

// Initialize Paystack
const paystackKey = process.env.PAYSTACK_SECRET_KEY;
const paystack = paystackKey ? Paystack(paystackKey) : null;

const isPaystackConfigured = () => {
  return paystack && paystackKey && paystackKey !== 'your_paystack_secret_key_here';
};

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
const processPayment = asyncHandler(async (req, res) => {
  const { amount, currency = 'GHS', method, description } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    throw new AppError('Valid amount required', 400);
  }

  if (!method) {
    throw new AppError('Payment method required', 400);
  }

  // Create payment record in database
  const { data: payment, error } = await supabase
    .from('payments')
    .insert([{
      user_id: userId,
      amount: parseFloat(amount),
      currency,
      method,
      description: description || 'Payment',
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;

  let response;
  const amountInPesewas = Math.round(parseFloat(amount) * 100);

  // Use Paystack if configured, otherwise mock
  if (!isPaystackConfigured()) {
    logger.warn('Paystack not configured, using mock payment');
    response = {
      status: 'pending',
      transactionId: `mock_${Date.now()}`,
      message: 'Payment initiated (MOCK MODE - Configure PAYSTACK_SECRET_KEY for real payments)'
    };
  } else {
    try {
      const initResponse = await paystack.transaction.initialize({
        email: req.user.email || `user_${userId}@sankofa.app`,
        amount: amountInPesewas,
        channels: method === 'mobile_money' 
          ? ['mobile_money'] 
          : method === 'bank_transfer' 
          ? ['bank_transfer'] 
          : ['card'],
        metadata: {
          payment_id: payment.id,
          user_id: userId
        }
      });

      response = {
        status: 'pending',
        transactionId: initResponse.data.reference,
        paymentUrl: initResponse.data.authorization_url,
        accessCode: initResponse.data.access_code
      };
    } catch (err) {
      logger.error('Paystack error:', err);
      throw new AppError(err.message || 'Payment initialization failed', 500);
    }
  }

  // Update payment with transaction details
  await supabase
    .from('payments')
    .update({
      status: response.status,
      transaction_id: response.transactionId
    })
    .eq('id', payment.id);

  logger.info('Payment processed', { paymentId: payment.id, method, userId });

  res.json({
    success: true,
    message: 'Payment initiated',
    data: {
      payment: {
        ...payment,
        ...response
      }
    }
  });
});

// @desc    Get payment status
// @route   GET /api/payments/:paymentId/status
// @access  Private
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (error || !payment) {
    throw new AppError('Payment not found', 404);
  }

  // Verify with Paystack if configured and has transaction ID
  if (payment.transaction_id && isPaystackConfigured()) {
    try {
      const verification = await paystack.transaction.verify(payment.transaction_id);
      
      if (verification.data.status === 'success' && payment.status !== 'completed') {
        // Update payment status
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', payment.id);
        
        payment.status = 'completed';
        payment.completed_at = new Date().toISOString();
      }
    } catch (err) {
      logger.error('Payment verification error:', err);
    }
  }

  res.json({
    success: true,
    data: { payment }
  });
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, method } = req.query;
  const userId = req.user.id;

  const from = (page - 1) * limit;
  const to = from + parseInt(limit) - 1;

  let query = supabase
    .from('payments')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }

  if (method) {
    query = query.eq('method', method);
  }

  const { data: payments, error, count } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: {
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// @desc    Refund payment
// @route   POST /api/payments/:paymentId/refund
// @access  Private (Admin)
const refundPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { reason } = req.body;

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (error || !payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.status !== 'completed') {
    throw new AppError('Only completed payments can be refunded', 400);
  }

  // Process refund with Paystack if configured
  if (isPaystackConfigured() && payment.transaction_id) {
    try {
      await paystack.refund.create({
        transaction: payment.transaction_id,
        merchant_note: reason
      });
    } catch (err) {
      logger.error('Paystack refund error:', err);
      throw new AppError(err.message || 'Refund failed', 500);
    }
  }

  // Update payment status
  await supabase
    .from('payments')
    .update({
      status: 'refunded',
      refund_reason: reason,
      refunded_at: new Date().toISOString()
    })
    .eq('id', payment.id);

  logger.info('Payment refunded', { paymentId, reason });

  res.json({
    success: true,
    message: 'Payment refunded successfully',
    data: {
      refund: {
        id: `ref_${Date.now()}`,
        paymentId,
        amount: payment.amount,
        status: 'processed',
        reason
      }
    }
  });
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private (Admin)
const getPaymentStats = asyncHandler(async (req, res) => {
  const { data: payments, error } = await supabase
    .from('payments')
    .select('amount, status, method');

  if (error) throw error;

  const stats = {
    totalPayments: payments.length,
    totalAmount: Math.round(payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) * 100) / 100,
    successfulPayments: payments.filter(p => p.status === 'completed').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    averageAmount: payments.length > 0 
      ? Math.round((payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) / payments.length) * 100) / 100 
      : 0,
    paymentMethods: {
      mobile_money: payments.filter(p => p.method === 'mobile_money').length,
      bank_transfer: payments.filter(p => p.method === 'bank_transfer').length,
      credit_card: payments.filter(p => ['credit_card', 'debit_card'].includes(p.method)).length
    }
  };

  logger.info('Payment stats retrieved');

  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Process mobile money payment
// @route   POST /api/payments/mobile-money
// @access  Private
const processMobileMoneyPayment = asyncHandler(async (req, res) => {
  const { phoneNumber, network, amount, currency = 'GHS' } = req.body;
  const userId = req.user.id;

  if (!phoneNumber || !network || !amount) {
    throw new AppError('Phone number, network, and amount are required', 400);
  }

  // Create payment record
  const { data: payment, error } = await supabase
    .from('payments')
    .insert([{
      user_id: userId,
      amount: parseFloat(amount),
      currency,
      method: 'mobile_money',
      description: `Mobile Money Payment (${network})`,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;

  let response;

  if (!isPaystackConfigured()) {
    logger.warn('Paystack not configured, using mock mobile money');
    response = {
      status: 'pending',
      transactionId: `mm_mock_${Date.now()}`,
      message: 'Mobile money payment initiated (MOCK MODE)'
    };
  } else {
    try {
      const amountInPesewas = Math.round(parseFloat(amount) * 100);
      
      const initResponse = await paystack.transaction.initialize({
        email: req.user.email || `user_${userId}@sankofa.app`,
        amount: amountInPesewas,
        channels: ['mobile_money'],
        mobile_money: {
          phone: phoneNumber,
          provider: network.toLowerCase()
        },
        metadata: {
          payment_id: payment.id,
          user_id: userId,
          network
        }
      });

      response = {
        status: 'pending',
        transactionId: initResponse.data.reference,
        paymentUrl: initResponse.data.authorization_url
      };
    } catch (err) {
      logger.error('Mobile money payment error:', err);
      throw new AppError(err.message || 'Mobile money payment failed', 500);
    }
  }

  // Update payment
  await supabase
    .from('payments')
    .update({
      transaction_id: response.transactionId,
      status: response.status
    })
    .eq('id', payment.id);

  logger.info('Mobile money payment processed', { paymentId: payment.id, network });

  res.json({
    success: true,
    message: 'Mobile money payment initiated',
    data: {
      payment: {
        ...payment,
        ...response
      }
    }
  });
});

// @desc    Process bank transfer
// @route   POST /api/payments/bank-transfer
// @access  Private
const processBankTransfer = asyncHandler(async (req, res) => {
  const { accountNumber, bankCode, accountName, amount, currency = 'GHS' } = req.body;
  const userId = req.user.id;

  if (!amount) {
    throw new AppError('Amount is required', 400);
  }

  // Create payment record
  const { data: payment, error } = await supabase
    .from('payments')
    .insert([{
      user_id: userId,
      amount: parseFloat(amount),
      currency,
      method: 'bank_transfer',
      description: 'Bank Transfer Payment',
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;

  let response;

  if (!isPaystackConfigured()) {
    logger.warn('Paystack not configured, using mock bank transfer');
    response = {
      status: 'pending',
      transactionId: `bt_mock_${Date.now()}`,
      message: 'Bank transfer initiated (MOCK MODE)'
    };
  } else {
    try {
      const amountInPesewas = Math.round(parseFloat(amount) * 100);
      
      const initResponse = await paystack.transaction.initialize({
        email: req.user.email || `user_${userId}@sankofa.app`,
        amount: amountInPesewas,
        channels: ['bank_transfer'],
        metadata: {
          payment_id: payment.id,
          user_id: userId
        }
      });

      response = {
        status: 'pending',
        transactionId: initResponse.data.reference,
        paymentUrl: initResponse.data.authorization_url
      };
    } catch (err) {
      logger.error('Bank transfer error:', err);
      throw new AppError(err.message || 'Bank transfer failed', 500);
    }
  }

  // Update payment
  await supabase
    .from('payments')
    .update({
      transaction_id: response.transactionId,
      status: response.status
    })
    .eq('id', payment.id);

  logger.info('Bank transfer processed', { paymentId: payment.id });

  res.json({
    success: true,
    message: 'Bank transfer initiated',
    data: {
      payment: {
        ...payment,
        ...response
      }
    }
  });
});

// @desc    Process card payment
// @route   POST /api/payments/card
// @access  Private
const processCardPayment = asyncHandler(async (req, res) => {
  const { amount, currency = 'GHS' } = req.body;
  const userId = req.user.id;

  if (!amount) {
    throw new AppError('Amount is required', 400);
  }

  // Create payment record
  const { data: payment, error } = await supabase
    .from('payments')
    .insert([{
      user_id: userId,
      amount: parseFloat(amount),
      currency,
      method: 'credit_card',
      description: 'Card Payment',
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;

  let response;

  if (!isPaystackConfigured()) {
    logger.warn('Paystack not configured, using mock card payment');
    response = {
      status: 'pending',
      transactionId: `card_mock_${Date.now()}`,
      message: 'Card payment initiated (MOCK MODE)'
    };
  } else {
    try {
      const amountInPesewas = Math.round(parseFloat(amount) * 100);
      
      const initResponse = await paystack.transaction.initialize({
        email: req.user.email || `user_${userId}@sankofa.app`,
        amount: amountInPesewas,
        channels: ['card'],
        metadata: {
          payment_id: payment.id,
          user_id: userId
        }
      });

      response = {
        status: 'pending',
        transactionId: initResponse.data.reference,
        paymentUrl: initResponse.data.authorization_url,
        accessCode: initResponse.data.access_code
      };
    } catch (err) {
      logger.error('Card payment error:', err);
      throw new AppError(err.message || 'Card payment failed', 500);
    }
  }

  // Update payment
  await supabase
    .from('payments')
    .update({
      transaction_id: response.transactionId,
      status: response.status
    })
    .eq('id', payment.id);

  logger.info('Card payment processed', { paymentId: payment.id });

  res.json({
    success: true,
    message: 'Card payment initiated',
    data: {
      payment: {
        ...payment,
        ...response
      }
    }
  });
});

// @desc    Webhook handler for Paystack
// @route   POST /api/payments/webhook
// @access  Public
const webhookHandler = asyncHandler(async (req, res) => {
  const { event, data } = req.body;

  logger.info('Payment webhook received', { event, reference: data?.reference });

  switch (event) {
    case 'charge.success':
      if (data.reference) {
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('transaction_id', data.reference);
        
        logger.info('Payment completed via webhook', { reference: data.reference });
      }
      break;

    case 'charge.failed':
      if (data.reference) {
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('transaction_id', data.reference);
        
        logger.info('Payment failed via webhook', { reference: data.reference });
      }
      break;

    case 'refund.processed':
      if (data.transaction) {
        await supabase
          .from('payments')
          .update({
            status: 'refunded',
            refunded_at: new Date().toISOString()
          })
          .eq('transaction_id', data.transaction);
        
        logger.info('Refund processed via webhook', { transaction: data.transaction });
      }
      break;

    default:
      logger.warn('Unknown webhook event', { event });
  }

  res.json({
    success: true,
    message: 'Webhook processed successfully'
  });
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
const getPaymentMethods = asyncHandler(async (req, res) => {
  const methods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Pay with MTN, Vodafone, or AirtelTigo',
      icon: 'mobile',
      enabled: true,
      providers: ['MTN', 'Vodafone', 'AirtelTigo']
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: 'bank',
      enabled: true
    },
    {
      id: 'credit_card',
      name: 'Card Payment',
      description: 'Visa, Mastercard, Verve',
      icon: 'credit-card',
      enabled: true
    }
  ];

  res.json({
    success: true,
    data: {
      methods,
      paystackConfigured: isPaystackConfigured()
    }
  });
});

// @desc    Update payment method
// @route   PUT /api/payments/methods/:methodId
// @access  Private
const updatePaymentMethod = asyncHandler(async (req, res) => {
  const { methodId } = req.params;
  const { enabled } = req.body;
  
  logger.info('Payment method updated', { methodId, enabled });

  res.json({
    success: true,
    message: 'Payment method updated successfully',
    data: {
      method: {
        id: methodId,
        enabled,
        updatedAt: new Date().toISOString()
      }
    }
  });
});

module.exports = {
  processPayment,
  getPaymentStatus,
  getPaymentHistory,
  refundPayment,
  getPaymentStats,
  processMobileMoneyPayment,
  processBankTransfer,
  processCardPayment,
  webhookHandler,
  getPaymentMethods,
  updatePaymentMethod
};
