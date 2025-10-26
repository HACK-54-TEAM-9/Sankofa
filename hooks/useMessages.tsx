import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { messagesAPI } from '../utils/api';

export function useMessages() {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const result = await messagesAPI.getMessages(accessToken);
      setMessages(result.messages || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [accessToken]);

  const sendMessage = async (recipientId: string, subject: string, content: string) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const result = await messagesAPI.sendMessage(accessToken, {
        recipientId,
        subject,
        content,
      });

      // Refresh messages
      await fetchMessages();

      return result;
    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      await messagesAPI.markAsRead(accessToken, messageId);

      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (err: any) {
      console.error('Error marking message as read:', err);
      throw err;
    }
  };

  return { messages, loading, error, sendMessage, markAsRead, refreshMessages: fetchMessages };
}
