import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const quickReplies = [
  'How does Sankofa-Coin work?',
  'How do I become a collector?',
  'What plastics do you accept?',
  'How is my data used?',
  'Where are collection hubs?',
];

// Fallback responses if AI is unavailable
const fallbackResponses: Record<string, string> = {
  'how does sankofa-coin work': 'Sankofa-Coin transforms plastic pollution into healthcare access! Collectors bring plastic waste to collection hubs, get paid for their contributions, and help fund community health initiatives. Our AI analyzes the data to predict health risks in your area.',
  'how do i become a collector': 'Becoming a collector is easy! Visit a collection hub in your area, register with a hub manager (provide phone number, name, neighborhood), receive your collector ID or card, and start collecting plastic waste. You\'ll earn money for every kilogram you collect (typically 2 GHS per kg)!',
  'what plastics do you accept': 'We accept PET bottles (water bottles, soda bottles), HDPE containers (milk jugs, detergent bottles), LDPE bags (shopping bags), PP containers (yogurt containers, bottle caps), and PS packaging (foam containers). All plastics should be clean and sorted by type for easier processing.',
  'how is my data used': 'Your privacy is our priority! We use anonymized collection data to predict health risks and disease patterns. No personal information is shared, and all data is encrypted and secure. The data helps us predict disease patterns and environmental health risks in your community.',
  'where are collection hubs': 'We have hubs across Ghana including Accra Central Hub, Tema Industrial Hub, Kumasi Regional Hub, and Takoradi Coastal Hub. Visit our website for an interactive map to find the nearest hub to you!',
  'default': 'Thank you for your question! Our team is here to help. For more information, please explore our website or contact us directly. Is there anything specific I can help you with about Sankofa-Coin?',
};

const getFallbackResponse = (userMessage: string): string => {
  const normalizedMessage = userMessage.toLowerCase().trim();
  
  // Check for exact or partial matches
  for (const [key, response] of Object.entries(fallbackResponses)) {
    if (key !== 'default' && normalizedMessage.includes(key.replace(/\?/g, ''))) {
      return response;
    }
  }
  
  return fallbackResponses.default;
};

export function CustomerServiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your Sankofa-Coin AI assistant. I can answer questions about our program, how to become a collector, plastic types we accept, and more. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.sender !== 'bot' || msg.id !== '1') // Exclude initial greeting
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      console.log('Sending chatbot request to:', `https://${projectId}.supabase.co/functions/v1/make-server-6c51ae02/chatbot`);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6c51ae02/chatbot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory,
          }),
        }
      );

      console.log('Chatbot response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chatbot error response:', errorText);
        // Fall back to predefined responses
        console.log('Falling back to predefined responses');
        return getFallbackResponse(userMessage);
      }

      const data = await response.json();
      console.log('Chatbot response data:', data);
      
      // Check if we have a valid response
      if (data && data.response) {
        return data.response;
      }
      
      // Fall back if response format is unexpected
      console.warn('Unexpected response format, using fallback');
      return getFallbackResponse(userMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Use fallback responses instead of generic error message
      console.log('Exception caught, using fallback responses');
      return getFallbackResponse(userMessage);
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Get AI response
    const aiResponseText = await getAIResponse(messageText);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponseText,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-[#FBBF24]"></span>
        </span>
      </button>
    );
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 border border-gray-100 shadow-xl bg-white transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } rounded-2xl flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#10b981] to-[#14b8a6] rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white">Sankofa Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <span className="text-xs text-white/90">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${
                    message.sender === 'bot'
                      ? 'bg-gradient-to-br from-[#10b981] to-[#059669]'
                      : 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb]'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    <Bot className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`flex flex-col max-w-[70%] ${
                    message.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      message.sender === 'bot'
                        ? 'bg-white border border-gray-100 text-gray-900'
                        : 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-br from-[#10b981] to-[#059669] hover:opacity-90 rounded-full px-4 disabled:opacity-50"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
