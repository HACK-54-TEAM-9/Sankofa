const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * @desc    Get all messages for authenticated user
 * @route   GET /api/messages
 * @access  Private
 */
exports.getMessages = async (req, res) => {
  const userId = req.user.id;

  // Get messages where user is sender or recipient
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(id, name, email, role),
      recipient:recipient_id(id, name, email, role)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
};

/**
 * @desc    Send a new message
 * @route   POST /api/messages
 * @access  Private
 */
exports.sendMessage = async (req, res) => {
  const { recipientId, subject, content } = req.body;
  const senderId = req.user.id;

  // Verify recipient exists
  const { data: recipient, error: recipientError } = await supabase
    .from('users')
    .select('id')
    .eq('id', recipientId)
    .single();

  if (recipientError || !recipient) {
    return res.status(404).json({
      success: false,
      message: 'Recipient not found'
    });
  }

  // Create message
  const { data: message, error } = await supabase
    .from('messages')
    .insert([{
      sender_id: senderId,
      recipient_id: recipientId,
      subject,
      content,
      read: false
    }])
    .select(`
      *,
      sender:sender_id(id, name, email, role),
      recipient:recipient_id(id, name, email, role)
    `)
    .single();

  if (error) {
    logger.error('Error sending message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }

  // TODO: Send push notification to recipient
  // TODO: Send email notification to recipient

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: message
  });
};

/**
 * @desc    Mark message as read
 * @route   PUT /api/messages/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check if message exists and user is the recipient
  const { data: message, error: fetchError } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  if (message.recipient_id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to mark this message as read'
    });
  }

  // Update message
  const { data: updatedMessage, error } = await supabase
    .from('messages')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Error marking message as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating message',
      error: error.message
    });
  }

  res.status(200).json({
    success: true,
    message: 'Message marked as read',
    data: updatedMessage
  });
};

/**
 * @desc    Delete message
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check if message exists and user is sender or recipient
  const { data: message, error: fetchError } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  if (message.sender_id !== userId && message.recipient_id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this message'
    });
  }

  // Soft delete - just mark as deleted for the user
  const updateField = message.sender_id === userId
    ? { deleted_by_sender: true }
    : { deleted_by_recipient: true };

  const { error } = await supabase
    .from('messages')
    .update(updateField)
    .eq('id', id);

  if (error) {
    logger.error('Error deleting message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully'
  });
};

/**
 * @desc    Get unread message count
 * @route   GET /api/messages/unread-count
 * @access  Private
 */
exports.getUnreadCount = async (req, res) => {
  const userId = req.user.id;

  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('read', false)
    .eq('deleted_by_recipient', false);

  if (error) {
    logger.error('Error getting unread count:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting unread count',
      error: error.message
    });
  }

  res.status(200).json({
    success: true,
    data: { count: count || 0 }
  });
};
