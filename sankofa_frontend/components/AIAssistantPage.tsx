import { useState } from 'react';
import { Mic, Send, Sparkles, MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Sankofa AI, your health intelligence assistant. Ask me about plastic pollution, health risks in your area, or how collecting plastic can improve community health.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  const quickPrompts = [
    "What health risks does plastic pollution cause?",
    "How can I start collecting plastic?",
    "Show me health insights for my area",
    "What diseases are linked to plastic waste?"
  ];

  const handleVoiceClick = () => {
    setIsListening(!isListening);
    setPulseAnimation(!isListening);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('health risk') || lowerMessage.includes('disease')) {
      return "Plastic pollution is linked to respiratory diseases, waterborne illnesses, malaria, and cholera. Blocked drains from plastic waste create breeding grounds for disease-carrying mosquitoes. I can provide specific insights for your area - just share your location!";
    } else if (lowerMessage.includes('collect') || lowerMessage.includes('start')) {
      return "Great! You can start by registering as a Collector. Find your nearest hub, collect plastic waste, and earn rewards while improving community health. Each kilogram you collect helps prevent disease and funds healthcare access.";
    } else if (lowerMessage.includes('area') || lowerMessage.includes('location')) {
      return "I can analyze health data for your specific area! Visit the Location Insights page to see malaria risk, water quality, respiratory health data, and personalized prevention tips based on plastic pollution levels.";
    } else {
      return "I'm here to help you understand the connection between plastic pollution and health. I can provide insights on health risks, collection opportunities, and community impact. What would you like to know?";
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f1f] via-[#0d2d3d] to-[#1a4d5c] relative overflow-hidden">
      {/* Gradient Overlay Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm">Powered by AI Health Intelligence</span>
          </div>
          
          <h1 className="text-white mb-4">
            Talk to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">Sankofa AI</span>
          </h1>
          <h2 className="text-white/80 mb-2">Smarter Health Insights, Faster Action, Better Communities</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Your intelligent assistant for understanding plastic pollution health impacts, finding collection opportunities, and accessing personalized health insights for Ghana
          </p>
        </div>

        {/* Main AI Orb Section */}
        {!showChat ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]">
            {/* AI Orb */}
            <div className="relative mb-12">
              {/* Outer glow rings */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-2xl opacity-30 ${pulseAnimation ? 'animate-ping' : ''}`} style={{ width: '300px', height: '300px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              
              {/* Main orb container */}
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* Particle effect layer */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 opacity-80" />
                
                {/* Grid pattern overlay */}
                <div 
                  className="absolute inset-0 rounded-full opacity-40"
                  style={{
                    background: `
                      repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px),
                      repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)
                    `
                  }}
                />
                
                {/* Inner glow */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 blur-xl opacity-60" />
                
                {/* Center microphone icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ${isListening ? 'scale-110' : ''} transition-transform`}>
                    <Mic className={`w-8 h-8 md:w-10 md:h-10 ${isListening ? 'text-red-400' : 'text-white'}`} />
                  </div>
                </div>

                {/* Animated rings */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </div>
            </div>

            {/* Voice Button */}
            <Button
              onClick={handleVoiceClick}
              className="mb-8 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-6 rounded-full shadow-lg shadow-blue-500/30"
            >
              <Mic className="w-5 h-5 mr-2" />
              {isListening ? 'Stop Speaking' : 'Speak with Sankofa AI'}
            </Button>

            {isListening && (
              <div className="text-center mb-8">
                <p className="text-white/80 animate-pulse">Listening...</p>
                <p className="text-white/60 text-sm mt-2">Try saying: "What health risks does plastic pollution cause?"</p>
              </div>
            )}

            {/* Quick Prompts */}
            <div className="w-full max-w-3xl">
              <p className="text-white/60 text-center mb-4">Or try these quick questions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-xl px-4 py-3 text-left text-white/80 hover:text-white transition-all duration-200"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-sm">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Toggle Button */}
            <Button
              onClick={() => setShowChat(true)}
              variant="outline"
              className="mt-8 border-white/20 text-white hover:bg-white/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Switch to Chat Mode
            </Button>
          </div>
        ) : (
          /* Chat Interface */
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600/20 to-teal-600/20 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white">Sankofa AI Assistant</h3>
                    <p className="text-white/60 text-sm">Online • Ready to help</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowChat(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                          : 'bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-white/10 px-6 py-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about plastic pollution and health..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500/50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-white/40 text-xs mt-2">
                  Powered by AI • Trained on Ghana health data and plastic pollution research
                </p>
              </div>
            </Card>

            {/* Quick Actions Below Chat */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm mb-1">Health Insights</h4>
                    <p className="text-white/60 text-xs">Get location-based health data</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm mb-1">Collection Tips</h4>
                    <p className="text-white/60 text-xs">Learn how to collect plastic</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm mb-1">Impact Data</h4>
                    <p className="text-white/60 text-xs">See your community impact</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Section */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-white mb-2">How Sankofa AI Helps You</h3>
            <p className="text-white/60 max-w-2xl mx-auto">
              Our AI assistant combines plastic pollution data with health intelligence to provide actionable insights for Ghanaian communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white mb-2">Predictive Health Intelligence</h4>
              <p className="text-white/60 text-sm">
                Get insights on health risks based on plastic pollution levels in your area
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white mb-2">24/7 Support</h4>
              <p className="text-white/60 text-sm">
                Ask questions anytime via voice or chat in English or local languages
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white mb-2">Voice Accessibility</h4>
              <p className="text-white/60 text-sm">
                Speak naturally to get help - perfect for low-literacy users and feature phones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
